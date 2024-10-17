import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceUserService } from 'src/app/api/service_user/service-user.service';
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

  constructor(private _userService : ServiceUserService, private router : Router) { }

  ngOnInit() {
    //Se obtiene el user seteado en el User Service
    this._userService.user$.subscribe(user => {
      this.user = user;
      console.log('Usuario en contactos:', this.user);
    });
  }

  irHome(){
    this.router.navigate(['home'])
  }

}
