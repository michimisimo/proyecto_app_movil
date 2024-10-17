import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceAmigosService } from 'src/app/api/service_amigos/service-amigos.service';
import { ServiceUserService } from 'src/app/api/service_user/service-user.service';
import { ServiceUsuarioService } from 'src/app/api/service_usuario/service-usuario.service';
import { Amigo } from 'src/app/models/amigo';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.page.html',
  styleUrls: ['./contactos.page.scss'],
})
export class ContactosPage implements OnInit {

  user: User | null = {
    id_user:0,
    usuario: '',
    password: ''
  };

  perfilUsuario: PerfilUsuario | null = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: ''
  }

  mostrarLista: string = 'todos';

  listaAmistades: Amigo[] = []

  listaContactos: Amigo[] = []

  listaPerfiles: PerfilUsuario[] = [];

  constructor(private _userService : ServiceUserService, private router : Router, private _amigoService : ServiceAmigosService, private _usuarioService : ServiceUsuarioService) { }

  ngOnInit() {
    //Se obtiene el user seteado en el User Service
    this._userService.user$.subscribe(user => {
      this.user = user;
      console.log('User en contactos:', this.user);
    });
    //Se obtiene el usuario seteado en el Usuario Service
    this._usuarioService.usuario$.subscribe(usuario => {
      this.perfilUsuario = usuario;
      console.log('Usuario en contactos:', this.perfilUsuario);
    });
    this.obtenerContactos();
    
  }

  irHome(){
    this.router.navigate(['home'])
  }

  mostrarContactos() {
    this.mostrarLista = 'contactos';
  }

  mostrarSolicitudes() {
    this.mostrarLista = 'solicitudes';
  }

  mostrarAgregarContacto() {
    this.mostrarLista = 'agregar-contacto';
  }

  obtenerContactos(){
    this._amigoService.getAmigo().subscribe({
      next: (response) => {
        if (response.body != null) {
          this.listaAmistades = response.body;
          const listaContactos = [];   
          for (let i = 0; i < this.listaAmistades.length; i++) {
            if(this.perfilUsuario){
              if (this.listaAmistades[i].id_persona1 == this.perfilUsuario.id_persona){
                listaContactos.push(this.listaAmistades[i]);
                this.listaContactos = listaContactos;
              }
            }            
          }
          this.obtenerPerfiles(listaContactos);
          console.log("Lista amistades"+JSON.stringify(this.listaAmistades));
          console.log("Lista contactos"+JSON.stringify(this.listaContactos)); 
        } else {
          console.error('No se encontró la lista de contactos');
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  obtenerPerfiles(listaContactos:Amigo[]){
    const listaPerfiles: PerfilUsuario[] = [];
    for (let i = 0; i < listaContactos.length; i++) {
      this._usuarioService.getUsuarioById(listaContactos[i].id_persona2).subscribe ({
        next: (response) => {
          if(response.body){
            if (this.perfilUsuario){
              listaPerfiles.push(response.body[0]);
              this.listaPerfiles = listaPerfiles;            
            }
            
          }else{
            console.log("No se encontraron perfiles para la lista de contactos")
          }
        }        
      });      
    }
    
  }

  

}
