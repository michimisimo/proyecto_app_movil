import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceAmigosService } from 'src/app/api/service_amistad/service-amistad.service';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { Amistad } from 'src/app/models/amistad';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.page.html',
  styleUrls: ['./contactos.page.scss'],
})
export class ContactosPage implements OnInit {

  perfilUsuario: PerfilUsuario | null = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: ''
  }

  mostrarLista: string = 'todos';

  listaAmistades: Amistad[] = []

  listaContactos: Amistad[] = []

  listaPerfiles: PerfilUsuario[] = [];

  constructor(private router : Router, private _amigoService : ServiceAmigosService, private _perfilUsuarioService : ServicePerfilUsuarioService) { }

  ngOnInit() {
    //Se obtiene el usuario seteado en el Usuario Service
    this._perfilUsuarioService.usuario$.subscribe(usuario => {
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

  //Obtiene lista de contactos de tipo Amistad[]
  obtenerContactos(){
    this._amigoService.getAmigo().subscribe({
      next: (response) => {
        if (response.body != null) {
          //listaAmistades de tipo Amistad[], contiene todas las filas de la tabla Amistad.
          this.listaAmistades = response.body;
          const listaContactos = [];   
          //Se recorre la lista de todas las amistades y se filtra por el id del perfil usuario logueado.
          for (let i = 0; i < this.listaAmistades.length; i++) {
            if(this.perfilUsuario){
              if (this.listaAmistades[i].id_persona1 == this.perfilUsuario.id_persona){
                listaContactos.push(this.listaAmistades[i]);
                //listaContactos contiene las filas de la tabla Amistad donde id_persona1 coincide con id del perfil usuario logueado.
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

  //Obtiene lista de perfiles de tipo PerfilUsuario[] de los contactos
  obtenerPerfiles(listaContactos:Amistad[]){
    const listaPerfiles: PerfilUsuario[] = [];
    for (let i = 0; i < listaContactos.length; i++) {
      this._perfilUsuarioService.getPerfilUsuarioById(listaContactos[i].id_persona2).subscribe ({
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
