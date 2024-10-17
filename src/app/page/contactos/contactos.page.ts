import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceAmigosService } from 'src/app/api/service_amigos/service-amigos.service';
import { ServiceUserService } from 'src/app/api/service_user/service-user.service';
import { Amigo } from 'src/app/models/amigo';
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

  mostrarLista: string = 'todos';

  listaAmistades: Amigo[] = []

  constructor(private _userService : ServiceUserService, private router : Router, private _amigoService : ServiceAmigosService) { }

  ngOnInit() {
    //Se obtiene el user seteado en el User Service
    this._userService.user$.subscribe(user => {
      this.user = user;
      console.log('Usuario en contactos:', this.user);
      this.obtenerListaAmistades();
    });
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

  obtenerListaAmistades(){
    this._amigoService.getAmigo().subscribe({
      next: (response) => {
        if (response.body != null) {
          this.listaAmistades = response.body;   
          console.log(this.listaAmistades)       
        } else {
          console.error('No se encontró la lista de contactos');
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  

  

}
