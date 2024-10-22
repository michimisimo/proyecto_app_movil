import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { Evento } from 'src/app/models/evento';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { ServiceInvitacionEventoService } from 'src/app/api/service_invitacion_evento/service-invitacion-evento.service';
import { InvitacionEvento } from 'src/app/models/invitacion_evento';
import { forkJoin, map, Observable } from 'rxjs';
import { Tag } from 'src/app/models/tag';
import { ServiceTagService } from 'src/app/api/service_tag/service-tag.service';
import { ServiceEventoTagService } from 'src/app/api/service_evento_tag/service-evento-tag.service';
import { TagEvento } from 'src/app/models/tag_evento';

@Component({
  selector: 'app-mis-eventos',
  templateUrl: './mis-eventos.page.html',
  styleUrls: ['./mis-eventos.page.scss'],
})
export class MisEventosPage implements OnInit {

  perfilUsuario: PerfilUsuario = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    id_user: 0
  };

  evento: Evento = {
    nombre: '',
    descripcion: '',
    fecha: new Date(),
    ubicacion: '',
    id_creador: 0,
    url_foto_portada: null
  };

  creador: string = '';
  listaEventos: Evento[] = [];
  listaInvitaciones: InvitacionEvento[] = [];
  listaTagsEvento: TagEvento[] = [];
  listaTags: Tag[] = [];

  constructor(
    private _eventoService: ServiceEventoService,
    private _perfilUsuarioService: ServicePerfilUsuarioService,
    private router: Router,
    private __invitacionService: ServiceInvitacionEventoService,
    private _tagService: ServiceTagService,
    private _tagEventoService: ServiceEventoTagService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    //Se obtiene el usuario seteado en el Usuario Service
    this._perfilUsuarioService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.perfilUsuario = usuario;
      }
      console.log('Usuario en mis-eventos:', this.perfilUsuario);
      this.obtenerListaMisEventos();
    });
    //Reload necesario para recargar la lista después de eliminar un evento
    this.route.queryParams.subscribe(params => {
      if (params['reload']) {
        this.obtenerListaMisEventos();
        this.obtenerTagsEvento();
      }
    });
  }

  obtenerListaMisEventos() {
    this.listaEventos = [];
    if (this.perfilUsuario.id_persona) {
      this._eventoService.getEventoByIdCreador(this.perfilUsuario.id_persona).subscribe({
        next: (response) => {
          if (response.body) {
            const listaAllEventos = response.body;
            for (const event of listaAllEventos) {
              if (event.deshabilitar == false) {
                this.listaEventos.push(event);
              }
            }
            console.log("Lista Eventos:" + JSON.stringify(this.listaEventos));
          }
          this.obtenerInvitaciones();
        }
      });
    }
  }

  abrirEvento(evento: Evento) {
    this.router.navigate(['evento'], { state: { id: evento.id_evento?.toString() } });
  }

  irHome() {
    this.router.navigate(['home']);
  }

  obtenerInvitaciones() {
    const idPersona = this.perfilUsuario?.id_persona;
    if (idPersona) {
      this.__invitacionService.getInvitacionByInvitadoId(idPersona).subscribe({
        next: (Response) => {
          this.listaInvitaciones = (Response.body || []);
          console.log('Mis invitaciones:', this.listaInvitaciones);

          // Filtrar invitaciones para eliminar las rechazadas y pendientes
          this.listaInvitaciones = this.listaInvitaciones.filter(invitacion => invitacion.id_estado !== 2 && invitacion.id_estado !== 3);

          this.listaInvitaciones.forEach(invitacion => {
            this._eventoService.getEventoById(invitacion.id_evento).subscribe({
              next: (Response) => {
                console.log('evento', Response.body);
                const evento = (Response.body || []);
                if (evento[0].deshabilitar == false){
                  this.listaEventos.push(...evento);
                }
                this.obtenerTagsEvento();
              },
              error: (err) => {
                console.error('Error al obtener eventos:', err);
              }
            });
          });

          this._eventoService.getEventoByIdCreador(this.perfilUsuario.id_persona!).subscribe({
            next: (Response) => {
              console.log('evento', Response.body)
              const evento = (Response.body || [])
            }
          })

          // Asegurarse de que cada invitación tenga un ID_evento válido
          this.listaInvitaciones.forEach(inv => {
            if (!inv.id_evento) {
              console.error('Invitación sin ID_evento:', inv);
            }
          });
        },
        error: (err) => {
          console.error('Error al obtener invitaciones:', err);
        }
      });
    } else {
      console.log('No se encontró id_persona en perfilUsuario');
    }
  }

  eventosCache = new Map<number, string>(); // Cache para eventos y creadores

  obtenerNombreCreador(id_evento: number): string {
    // Revisa si el evento ya está en caché
    if (this.eventosCache.has(id_evento)) {
      return this.eventosCache.get(id_evento)!;
    }

    // Busca el evento en la lista
    const evento = this.listaEventos.find(evento => evento.id_evento === id_evento);

    if (evento) {
      // Realiza la llamada para obtener el perfil del creador
      this._perfilUsuarioService.getPerfilUsuarioById(evento.id_creador).subscribe({
        next: (Response) => {
          const creadores: PerfilUsuario[] = Response.body || [];
          if (creadores.length > 0) {
            const creador = creadores[0];
            const nombreCompleto = `${creador.nombre} ${creador.apellido}`;

            // Guarda en cache el resultado para evitar futuras llamadas
            this.eventosCache.set(id_evento, nombreCompleto);
          }
        },
        error: (err) => {
          console.error('Error al obtener el creador', err);
        }
      });

      // Devuelve un mensaje provisional mientras se espera la respuesta
      return 'Cargando...';
    } else {
      return 'Evento no encontrado';
    }
  }

  eventTags: { [key: number]: Tag[] } = {};

  hasTagsForEvento(idEvento: number): boolean {
    return !!this.eventTags[idEvento] && this.eventTags[idEvento].length > 0;
  }

  obtenerTagsEvento() {
    console.log('obteniendo todos los tags de eventos');

    // Comprobar si ya tenemos los tags almacenados
    if (Object.keys(this.eventTags).length > 0) {
      console.log("Tags recuperados de la caché:", this.eventTags);
      return;
    }

    // Hacer la llamada para obtener todos los tags de eventos
    this._tagEventoService.getTagEvento().subscribe({
      next: (response) => {
        const listaTagEventos = response.body || [];
        console.log("Lista de tags de eventos:", listaTagEventos);

        // Crear solicitudes para obtener información de cada tag
        const tagRequests = listaTagEventos.map(tagEvento =>
          this._tagService.getTagById(tagEvento.id_tag).pipe(
            map(response => response.body)
          )
        );

        // Ejecutar todas las solicitudes en paralelo
        forkJoin(tagRequests).subscribe({
          next: (tags) => {
            // Filtrar y almacenar los tags obtenidos
            this.listaTags = tags.flat().filter((tag): tag is Tag => tag !== null && tag !== undefined);

            // Almacenar los tags en el mapa utilizando el id del evento como clave
            listaTagEventos.forEach(tagEvento => {
              if (!this.eventTags[tagEvento.id_evento]) {
                this.eventTags[tagEvento.id_evento] = [];
              }
              this.eventTags[tagEvento.id_evento].push(this.listaTags.find(tag => tag.id_tag === tagEvento.id_tag)!);
            });

            console.log("Tags obtenidos y almacenados:", this.eventTags);
          },
          error: (err) => {
            console.error("Error al obtener tags:", err);
          }
        });
      },
      error: (err) => {
        console.error("Error al obtener tags de eventos:", err);
      }
    });
  }



}
