import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { ServiceUserService } from 'src/app/api/service_user/service-user.service';
import { Evento } from 'src/app/models/evento';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
})
export class CrearEventoPage implements OnInit {

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


  constructor(
    private router: Router, private _perfilUsuarioService : ServicePerfilUsuarioService, 
    private _eventoService : ServiceEventoService
  ) { }

  ngOnInit() {
    //Se obtiene el usuario seteado en el Usuario Service
    this._perfilUsuarioService.usuario$.subscribe(usuario => {
      if(usuario){
        this.perfilUsuario = usuario;
      }      
      console.log('Usuario en crear-evento:', this.perfilUsuario);
    });
  }

  crearEvento() {
    if (this.perfilUsuario.id_persona){
      this.evento.id_creador=this.perfilUsuario.id_persona;
    }
    console.log("Evento: "+JSON.stringify(this.evento));

    this._eventoService.createEvento(this.evento).subscribe(response => {
      console.log('Evento creado con éxito', response);
    }, error => {
      console.error('Error al crear el evento', error);
    });
  }

  irHome() {
    this.router.navigate(['home']);
  }
}
