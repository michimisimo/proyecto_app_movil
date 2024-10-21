import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { Evento } from 'src/app/models/evento';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { ServiceInvitacionEventoService } from 'src/app/api/service_invitacion_evento/service-invitacion-evento.service';
import { InvitacionEvento } from 'src/app/models/invitacion_evento';
import { map, Observable } from 'rxjs';

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
    id_user: 0,
    id_rol: 0
  };

  evento: Evento = {
    nombre: '',
    descripcion: '',
    fecha: new Date(),
    ubicacion: '',
    id_creador: 0,
    id_lista_invitados: 0
  };

  creador: string = '';
  listaEventos: Evento[] = [];
  listaInvitaciones: InvitacionEvento[] = [];

  constructor(
    private _eventoService: ServiceEventoService,
    private _perfilUsuarioService: ServicePerfilUsuarioService,
    private router: Router,
    private __invitacionService: ServiceInvitacionEventoService) { }

  ngOnInit() {
    //Se obtiene el usuario seteado en el Usuario Service
    this._perfilUsuarioService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.perfilUsuario = usuario;
      }
      console.log('Usuario en mis-eventos:', this.perfilUsuario);
      this.obtenerListaMisEventos();
    });
  }

  obtenerListaMisEventos() {
    this.listaEventos = [];
    if (this.perfilUsuario.id_persona) {
      this._eventoService.getEventoByIdCreador(this.perfilUsuario.id_persona).subscribe({
        next: (response) => {
          if (response.body) {
            this.listaEventos = response.body;
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
                this.listaEventos.push(...evento);
              },
              error: (err) => {
                console.error('Error al obtener eventos:', err);
              }
            });
          });

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



}
