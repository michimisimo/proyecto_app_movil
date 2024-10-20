import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ServiceUserService } from 'src/app/api/service_user/service-user.service';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { Router } from '@angular/router';
import { InvitacionEvento } from 'src/app/models/invitacion_evento';
import { ServiceInvitacionEventoService } from 'src/app/api/service_invitacion_evento/service-invitacion-evento.service';
import { Evento } from 'src/app/models/evento';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  listaInvitaciones: InvitacionEvento[] = [];
  listaEventos: Evento[] = [];

  user: User | null = {
    id_user: 0,
    usuario: '',
    password: ''
  };

  perfilUsuario: PerfilUsuario | null = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: ''
  }

  constructor(
    private _userService: ServiceUserService,
    private _perfilUsuarioService: ServicePerfilUsuarioService,
    private router: Router,
    private __invitacionService: ServiceInvitacionEventoService,
    private _eventoService: ServiceEventoService) { }

  ngOnInit() {
    // Se obtiene el user seteado en el User Service
    this._userService.user$.subscribe(user => {
      this.user = user;
      console.log('User en home:', this.user);
    });
    this.obtenerPerfilUsuario();
    this.obtenerInvitaciones();
  }

  async obtenerPerfilUsuario(): Promise<void> {
    if (this.user != null && this.user.id_user) {
      try {
        const response = await this._perfilUsuarioService.getPerfilUsuarioByIdUser(this.user.id_user).toPromise();
        if (response && response.body != null) {
          this.perfilUsuario = response.body[0];
          this._perfilUsuarioService.setPerfilUsuario(this.perfilUsuario);

          // Una vez que se obtiene el perfil, llama a obtenerInvitaciones
          this.obtenerInvitaciones();
        } else {
          throw new Error('No se encontró el perfil del usuario');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("No se encontró el user");
    }
  }

  irCrearEvento() {
    this.router.navigate(['crear-evento']);
  }

  obtenerInvitaciones() {
    const idPersona = this.perfilUsuario?.id_persona;
    this.listaEventos = [];
    if (idPersona) {
      this.__invitacionService.getInvitacionByInvitadoId(idPersona).subscribe({
        next: (Response) => {
          this.listaInvitaciones = (Response.body || []);
          console.log('Mis invitaciones:', this.listaInvitaciones);

          this.listaInvitaciones.forEach(invitacion => {
            this._eventoService.getEventoById(invitacion.id_evento).subscribe({
              next: (Response) => {
                console.log('evento', Response.body);
                const evento = (Response.body || []);
                this.listaEventos.push(...evento);
              }, error: (err) => {
                console.error('Error al obtener eventos:', err);
              }
            })
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

  obtenerNombreEvento(id_evento: number): string {
    const evento = this.listaEventos.find(evento => evento.id_evento == id_evento);
    return evento ? evento.nombre : 'Evento no encontrado';
  }

  aceptarInvitacion(id_invitacion: number) {
    this.__invitacionService.updateEstado(id_invitacion, 1).subscribe({
      next: (response) => {
        console.log('invitacion aceptada con éxito:', response);
        this.listaInvitaciones = this.listaInvitaciones.filter(invitacion => invitacion.id_invitacion !== id_invitacion);
      },
      error: (err) => {
        console.error('Error al aceptar la invitacion:', err);
      }
    });
    this.obtenerInvitaciones();
  }

  rechazarInvitacion(id_invitacion: any) {
    this.__invitacionService.updateEstado(id_invitacion, 2).subscribe({
      next: (response) => {
        console.log('invitacion rechazada con éxito:', response);
        this.listaInvitaciones = this.listaInvitaciones.filter(invitacion => invitacion.id_invitacion !== id_invitacion);
      },
      error: (err) => {
        console.error('Error al rechazar la invitacion:', err);
      }
    });
    this.obtenerInvitaciones();
  }

}
