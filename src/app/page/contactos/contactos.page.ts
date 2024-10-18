import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceAmigosService } from 'src/app/api/service_amistad/service-amistad.service';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { Amistad } from 'src/app/models/amistad';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { forkJoin } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { SolicitudAmistadService } from 'src/app/api/service_solicitud_amistad/service-solicitud-amistad.service';
import { SolicitudAmistad } from 'src/app/models/solicitud_amistad';


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
  //Lista de id de usuarios a quienes ya se les envió solicitud
  listaIdsSolicitudes: Set<number> = new Set();

  constructor(
    private router: Router,
    private _amigoService: ServiceAmigosService,
    private _perfilUsuarioService: ServicePerfilUsuarioService,
    private _solicitudAmistadService: SolicitudAmistadService
  ) { }

  ngOnInit() {
    this._perfilUsuarioService.usuario$.subscribe(usuario => {
      this.perfilUsuario = usuario;
      this.obtenerContactos();
      this.obtenerSolicitudes();
    });
  }

  irHome() {
    this.router.navigate(['home']);
  }

  mostrarContactos() {
    this.mostrarLista = 'contactos';
  }

  mostrarSolicitudes() {
    this.mostrarLista = 'solicitudes';
  }

  mostrarAgregarContacto() {
    this.mostrarLista = 'agregar-contacto';
    this.obtenerPerfiles();
  }

  obtenerContactos() {
    this._amigoService.getAmigo().subscribe({
      next: (response) => {
        if (response.body) {
          const listaAmistades: Amistad[] = response.body;
          const contactosObservables = listaAmistades
            .filter(amistad => this.perfilUsuario && amistad.id_persona1 === this.perfilUsuario.id_persona)
            .map(amistad => this._perfilUsuarioService.getPerfilUsuarioById(amistad.id_persona2));

          forkJoin(contactosObservables).subscribe(perfiles => {
            this.listaContactos = perfiles.map((perfilResponse, index) => {
              if (perfilResponse.body && perfilResponse.body.length > 0) {
                return {
                  id: listaAmistades[index].id_persona2,
                  nombre: perfilResponse.body[0].nombre,
                  apellido: perfilResponse.body[0].apellido
                };
              }
              return {
                id: listaAmistades[index].id_persona2,
                nombre: 'Nombre no disponible',
                apellido: 'Apellido no disponible'
              };
            }).filter(contacto => contacto.nombre !== 'Nombre no disponible');
          });
        } else {
          console.error('No se encontró la lista de contactos');
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  obtenerSolicitudes() {
    if (this.perfilUsuario && this.perfilUsuario.id_persona) {
      this._solicitudAmistadService.getSolicitudAmistadByIdUser(this.perfilUsuario.id_persona).subscribe({
        next: (response) => {
          if (response.body) {
            this.listaSolicitudes = response.body;
            this.obtenerPerfilesSolicitudes();
            this.actualizarListaIdsSolicitudes(); // Añade esta línea
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  actualizarListaIdsSolicitudes() {
    this.listaIdsSolicitudes.clear(); // Limpia la lista antes de agregar
    this.listaSolicitudes.forEach(solicitud => {
      this.listaIdsSolicitudes.add(solicitud.id_destinatario);
    });
  }

  obtenerPerfilesSolicitudes() {
    this.listaPerfilesSolicitudes = [];
    if (this.listaSolicitudes.length > 0) {
      const observables = this.listaSolicitudes.map(solicitud =>
        this._perfilUsuarioService.getPerfilUsuarioById(solicitud.id_destinatario)
      );

      forkJoin(observables).subscribe(responses => {
        this.listaPerfilesSolicitudes = responses
          .map(perfilResponse => perfilResponse.body ? perfilResponse.body[0] : null) // Manejo de null
          .filter(perfil => perfil !== null) as PerfilUsuario[]; // Filtra null y asegura que el tipo es PerfilUsuario
      });
    }
  }

  obtenerPerfiles() {
    this._perfilUsuarioService.getPerfilUsuario().subscribe({
      next: (response: HttpResponse<PerfilUsuario[]>) => {
        if (response.body) {
          this.listaPerfiles = response.body.filter(perfil => perfil.id_persona !== this.perfilUsuario?.id_persona);
        } else {
          console.error("No se encontró la lista de perfiles");
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  agregarContacto(contactoId: number) {
    if (!this.perfilUsuario) {
      console.error("Perfil de usuario no encontrado.");
      return;
    }

    if (this.perfilUsuario.id_persona) {
      const solicitud: SolicitudAmistad = {
        id_estado: 3,
        id_solicitante: this.perfilUsuario.id_persona,
        id_destinatario: contactoId,
        fecha_solicitud: new Date()
      };

      this._solicitudAmistadService.createSolicitudAmistad(solicitud).subscribe({
        next: (response) => {
          console.log("Solicitud de amistad enviada:", response);
          // Aquí podrías manejar el estado de la solicitud, por ejemplo, mostrar un mensaje o actualizar el botón
        },
        error: (err) => {
          console.error("Error al enviar la solicitud de amistad:", err);
        }
      });
    }
  }
}
