import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ServiceAmigosService } from 'src/app/api/service_amistad/service-amistad.service';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { SolicitudAmistadService } from 'src/app/api/service_solicitud_amistad/service-solicitud-amistad.service';
import { Amistad } from 'src/app/models/amistad';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { SolicitudAmistad } from 'src/app/models/solicitud_amistad';
import { Evento } from 'src/app/models/evento';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { ServiceInvitacionEventoService } from 'src/app/api/service_invitacion_evento/service-invitacion-evento.service';


@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.page.html',
  styleUrls: ['./contactos.page.scss'],
})
export class ContactosPage implements OnInit {
  perfilUsuario: PerfilUsuario | null = null;
  mostrarLista: string = 'todos';
  listaContactos: { id: number; nombre: string; apellido: string }[] = [];
  listaPerfiles: PerfilUsuario[] = [];
  listaSolicitudes: SolicitudAmistad[] = [];
  listaPerfilesSolicitudes: PerfilUsuario[] = [];
  listaEventos: Evento[] = [];
  listaIdsSolicitudes: Set<number> = new Set();
  eventoSeleccionado: number | null = null;

  constructor(
    private router: Router,
    private _amigoService: ServiceAmigosService,
    private _perfilUsuarioService: ServicePerfilUsuarioService,
    private _solicitudAmistadService: SolicitudAmistadService,
    private _eventoService: ServiceEventoService,
    private _invitacionService: ServiceInvitacionEventoService,
  ) { }

  ngOnInit() {
    this._perfilUsuarioService.usuario$.subscribe(usuario => {
      this.perfilUsuario = usuario;
      this.cargarDatosIniciales();
    });
  }

  cargarDatosIniciales() {
    this.obtenerPerfiles();
    this.obtenerContactos();
    this.obtenerSolicitudes();
  }

  irHome() {
    this.router.navigate(['home']);
  }

  cambiarVista(vista: string) {
    this.mostrarLista = vista;
    if (vista === 'agregar-contacto') this.obtenerPerfiles();
  }

  eliminarContacto(id: number) {
  };

  invitarEvento(id: number) {

  };

  obtenerContactos() {
    const userId = this.perfilUsuario?.id_persona!

    if (!userId) {
      console.error('ID de usuario no válido.');
      return; // Salir si no hay ID de usuario
    }
    // Obtener las amistades del usuario
    this._amigoService.getAmigoById(userId).subscribe({
      next: (response) => {
        console.log('lista amistades:', response)
        const listaAmistades: Amistad[] = response.body || [];
        // Crear un array de observables para obtener los perfiles de los contactos
        const contactosObservables = listaAmistades.map(amistad => {
          // Determina el id_persona2 (el otro amigo) para obtener su perfil
          const idContacto = amistad.id_persona1 === userId ? amistad.id_persona2 : amistad.id_persona1;
          return this._perfilUsuarioService.getPerfilUsuarioById(idContacto);
        });

        // Verificar si hay observables antes de hacer la llamada
        if (contactosObservables.length === 0) {
          this.listaContactos = []; // Asignar un array vacío si no hay contactos
          return;
        }

        // Obtener los perfiles de los contactos
        forkJoin(contactosObservables).subscribe({
          next: (perfiles) => {
            this.listaContactos = perfiles
              .map((perfilResponse) => {
                const perfil = perfilResponse.body?.[0];
                return perfil ? {
                  id: perfil.id_persona, // Asumiendo que 'id_persona' es parte del perfil
                  nombre: perfil.nombre,
                  apellido: perfil.apellido
                } : null;
              })
              .filter(Boolean) as { id: number; nombre: string; apellido: string }[];
          },
          error: (err) => {
            console.error('Error al obtener perfiles de contactos:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener amistades:', err);
      }
    });
  }

  obtenerSolicitudes() {
    this._solicitudAmistadService.getSolicitudAmistadByIdUser(this.perfilUsuario?.id_persona!).subscribe({
      next: (response) => {
        // Vaciar las listas antes de comenzar a llenarlas
        this.listaSolicitudes = response.body || [];
        console.log('listaMisSolicitudes:', this.listaSolicitudes);

        // Actualizar la lista de IDs para controlar los que ya tienen solicitud
        this.actualizarListaIdsSolicitudes();

        // Obtener los perfiles relacionados a estas solicitudes
        this.obtenerPerfilesSolicitudes();
      },
      error: console.error
    });
  }

  actualizarListaIdsSolicitudes() {
    this.listaIdsSolicitudes = new Set(this.listaSolicitudes.map(s => s.id_destinatario));
  }

  obtenerPerfilesSolicitudes() {
    console.log('Solicitudes actuales:', this.listaSolicitudes);

    // Filtrar las solicitudes donde el usuario actual es el destinatario y el estado no sea 2
    const observables = this.listaSolicitudes
      .filter(solicitud =>
        solicitud.id_destinatario === this.perfilUsuario?.id_persona &&
        solicitud.id_estado !== 2 && solicitud.id_estado !== 1// Excluir solicitudes con id_estado igual a 2
      )
      .map(solicitud => {
        console.log('Obteniendo perfil para solicitud:', solicitud);
        return this._perfilUsuarioService.getPerfilUsuarioById(solicitud.id_solicitante); // Obtener el perfil del solicitante
      });

    console.log('Lista de observables:', observables);

    // Verificar si hay observables para evitar llamadas innecesarias
    if (observables.length === 0) {
      console.log('No hay solicitudes para procesar.');
      this.listaPerfilesSolicitudes = []; // Asignar un array vacío si no hay solicitudes
      return; // Salir de la función
    }

    forkJoin(observables).subscribe({
      next: (responses) => {
        console.log('Respuestas recibidas para los perfiles:', responses);
        this.listaPerfilesSolicitudes = responses
          .map(perfilResponse => perfilResponse.body?.[0]) // Obtener el primer perfil de la respuesta
          .filter(Boolean) as PerfilUsuario[]; // Filtrar valores falsy
        console.log('Perfiles de solicitudes:', this.listaPerfilesSolicitudes);
      },
      error: (err) => {
        console.error('Error al obtener perfiles de solicitudes', err);
      }
    });
  }

  obtenerPerfiles() {
    this.listaPerfiles = [];
    this._perfilUsuarioService.getPerfilUsuario().subscribe({
      next: (response) => {
        this.listaPerfiles = (response.body || [])
          .filter(perfil => perfil.id_persona !== this.perfilUsuario?.id_persona) // Excluir el perfil del usuario actual
          .filter(perfil =>
            // Excluir perfiles que estén como id_solicitante o id_destinatario en alguna solicitud
            !this.listaSolicitudes.some(s =>
              s.id_solicitante === perfil.id_persona || s.id_destinatario === perfil.id_persona
            )
          );
      },
      error: console.error
    });
  }

  agregarContacto(contactoId: number) {
    if (!this.perfilUsuario?.id_persona) {
      console.error("Perfil de usuario no encontrado.");
      return;
    }

    const solicitud: SolicitudAmistad = {
      id_estado: 3,
      id_solicitante: this.perfilUsuario.id_persona,
      id_destinatario: contactoId,
      fecha_solicitud: new Date()
    };

    console.log('solicitud amistad', solicitud)

    this._solicitudAmistadService.createSolicitudAmistad(solicitud).subscribe({
      next: () => this.cargarDatosIniciales(),
      error: console.error
    });
  }

  aceptarSolicitud(id_dest: number, id_sol: number) {
    // Asegurarse de que perfilUsuario esté definido antes de continuar
    if (!this.perfilUsuario) {
      console.error('Perfil de usuario no definido.');
      return; // Salir si no hay perfil de usuario
    }
    console.log()

    // Convertir id_persona a número entero de manera segura
    const idPersona = parseInt(this.perfilUsuario.id_persona?.toString() || '0', 10);
    console.log(idPersona)
    // Verificar que se haya obtenido un id_persona válido
    if (isNaN(idPersona) || idPersona <= 0) {
      console.error('ID de persona no válido:', idPersona);
      return; // Salir si id_persona no es válido
    }

    id_dest = idPersona;

    // Llamar al servicio para actualizar el estado de la solicitud
    this._solicitudAmistadService.updateEstado(id_sol, id_dest, 1).subscribe({
      next: (response) => {
        console.log('Solicitud de amistad aceptada con éxito:', response);
        const amistadData = {
          id_persona1: id_sol, // Asigna el id del solicitante
          id_persona2: id_dest // Asigna el id del destinatario
        };

        this._amigoService.createAmigo(amistadData).subscribe({
          next: (response) => {
            console.log('Amistad creada:', response);
          },
          error: (err) => {
            console.error('Error al crear amistad', err);
          }
        });

        this.cargarDatosIniciales()
      },
      error: (err) => {
        console.error('Error al aceptar la solicitud:', err);
        // Manejar el error según sea necesario
      }
    });
  }

  obtenerEventos() {
    this._eventoService.getEventoByIdCreador(this.perfilUsuario?.id_persona!).subscribe({
      next: (Response) => {
        this.listaEventos = (Response.body || []);
        console.log('mis eventos: ', this.listaEventos);
      },
      error: (err) => {
        console.error('Error al obtener mis eventos', err);
      }
    });
  }

  invitarContacto(id_invitado: number, id_evento: number | null) {
    console.log('id_contacto:', id_invitado, 'id_evento:', id_evento);
    if (id_evento && id_invitado) {
      const invitacionData = {
        id_invitado: id_invitado,
        id_evento: id_evento,
        id_rol: 2,
        id_estado: 3,
      };

      this._invitacionService.createInvitacion(invitacionData).subscribe({
        next: (Response) => {
          console.log('invitacion creada y enviada')
        },
        error: (err) => {
          console.error('Error al crear la invitacion', err);
        }
      })
    } else {
      console.log('no se selecciono un evento')
    }

  };

}
