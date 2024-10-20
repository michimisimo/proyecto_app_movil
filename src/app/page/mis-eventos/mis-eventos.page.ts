import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { Evento } from 'src/app/models/evento';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';

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

  listaEventos: Evento[] = [];

  constructor(
    private _eventoService : ServiceEventoService, 
    private _perfilUsuarioService : ServicePerfilUsuarioService, 
    private router : Router) { }

  ngOnInit() {
    //Se obtiene el usuario seteado en el Usuario Service
    this._perfilUsuarioService.usuario$.subscribe(usuario => {
      if(usuario){
        this.perfilUsuario = usuario;        
      }      
      console.log('Usuario en mis-eventos:', this.perfilUsuario);
      this.obtenerListaMisEventos();
    });
  }

  obtenerListaMisEventos(){
    if(this.perfilUsuario.id_persona){
      this._eventoService.getEventoByIdCreador(this.perfilUsuario.id_persona).subscribe({
        next: (response) => {
          if(response.body){
            this.listaEventos = response.body;
            console.log("Lista Eventos:"+JSON.stringify(this.listaEventos));
          }          
        }
      });
    }    
  }

  abrirEvento(evento : Evento){
    this.router.navigate(['evento'], { state: { id: evento.id_evento?.toString() } });
  }

  irHome() {
    this.router.navigate(['home']);
  }

}
