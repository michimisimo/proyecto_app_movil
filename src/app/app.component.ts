import { Component } from '@angular/core';
import { User } from './models/user';
import { Router } from '@angular/router';
import { ServiceUserService } from './api/service_user/service-user.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  user: User | null = null;
  
  constructor(private router: Router, private _userService : ServiceUserService, private menu: MenuController) {}

  ngOnInit() {
    this._userService.user$.subscribe(user => {
      this.user = user;
      console.log('Usuario en app components:', this.user);
    });
  }

  irVerPerfil() {
    this.menu.close(); 
    this.router.navigate(['perfil-usuario'])
  }

  irCrearEvento() {
    this.menu.close(); 
    //this.router.navigate(['/crear-evento']); 
  }

  irMisEventos() {
    this.menu.close(); 
    //this.router.navigate(['/mis-eventos']); 
  }

  irContactos(){
    this.menu.close(); 
    this.router.navigate(['contactos'])
  }

  irConfiguracion() {
    this.menu.close(); 
    //this.router.navigate(['/configuracion']); 
  }

  irAyuda() {
    this.menu.close(); 
    //this.router.navigate(['/ayuda']); 
  }
}

