import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { Evento } from 'src/app/models/evento';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { InvitacionEvento } from 'src/app/models/invitacion_evento';
import { ServiceInvitacionEventoService } from 'src/app/api/service_invitacion_evento/service-invitacion-evento.service';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
})
export class EventoPage implements OnInit {

  evento: Evento = {
    id_evento: 0,
    nombre: '',
    descripcion: '',
    fecha: new Date(),
    ubicacion: '',
    id_creador: 0,
    id_lista_invitados: 0
  };

  listaEventos: Evento[] = [];
  listaInvitaciones: InvitacionEvento[] = [];
  listaInvitados: PerfilUsuario[] = [];
  invitadosCargados: boolean = false; // Variable de estado para controlar la carga


  constructor(private router: Router, private _eventoService: ServiceEventoService, private _perfilUsuarioService: ServicePerfilUsuarioService, private _invitacionService: ServiceInvitacionEventoService) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      console.log("Id evento por navegacion: " + navigation.extras.state['id'])
      this.evento.id_evento = navigation.extras.state['id'];
      console.log('ID del evento:', this.evento.id_evento);
      this.obtenerEvento();
    }
  }

  accordionGroupChange = (id_evento: number) => {
    if (!this.invitadosCargados) { // Verifica si los invitados ya han sido cargados
      this.obtenerInvitados(id_evento);
      this.invitadosCargados = true; // Marca que los invitados ya se han cargado
      console.log('acordeon activado');
    }
  };

  obtenerEvento() {
    if (this.evento.id_evento) {
      this._eventoService.getEventoById(this.evento.id_evento).subscribe({
        next: (response) => {
          if (response.body) {
            this.evento = response.body[0];
            console.log("Evento:" + JSON.stringify(this.evento));
          }
        }
      })
    }
  }

  eventosCache = new Map<number, string>(); // Cache para eventos y creadores

  obtenerNombreCreador(id_evento: number): string {
    // Revisa si el evento ya está en caché
    if (this.eventosCache.has(id_evento)) {
      return this.eventosCache.get(id_evento)!;
    }

    this._eventoService.getEventos().subscribe({
      next: (Response) =>
        this.listaEventos = (Response.body || [])
    })
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

  // Cache para almacenar los invitados de cada evento
  invitadosCache = new Map<number, PerfilUsuario[]>(); // Mapa donde la clave es el id_evento

  obtenerInvitados(eventoId: number): void {
    console.log('ejecutando funcion para invitados')
    // Revisa si ya tenemos los invitados en caché
    if (this.invitadosCache.has(eventoId)) {
      this.listaInvitados = this.invitadosCache.get(eventoId)!;
      // Obtiene los invitados del caché
      return; // Salimos de la función ya que no es necesario hacer una llamada a la API
    }

    // Inicializa la lista de invitados vacía
    this.listaInvitados = [];

    // Obtiene las invitaciones del evento
    this._invitacionService.getInvitacionByEventoId(eventoId).subscribe({
      next: (Response) => {
        const listaInvitaciones = (Response.body || [])
          .filter(invitacion => invitacion.id_estado === 1); // Filtra los invitados confirmados

        console.log(listaInvitaciones)

        // Usamos Promise.all para esperar todas las consultas a los perfiles de los invitados
        const perfilPromises = listaInvitaciones.map(invitacion =>
          this._perfilUsuarioService.getPerfilUsuarioById(invitacion.id_invitado).toPromise()
        );

        // Cuando todas las promesas se resuelven, llenamos la lista de invitados
        Promise.all(perfilPromises).then((perfiles) => {
          this.listaInvitados = perfiles
            .map(Response => Response?.body ? Response.body[0] : null) // Asigna el perfil o null si no existe
            .filter(invitado => invitado !== null) as PerfilUsuario[]; // Filtra los nulos y asegura que sea del tipo correcto

          // Guarda los invitados en caché
          this.invitadosCache.set(eventoId, this.listaInvitados);
        }).catch(err => {
          console.error('Error al obtener perfiles de invitados', err);
        });
      },
      error: (err) => {
        console.error('Error al obtener invitaciones del evento', err);
      }
    });
  }

  irHome() {
    this.router.navigate(['home']);
  }

}
