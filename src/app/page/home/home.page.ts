import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { ServiceUserService } from 'src/app/api/service_user/service-user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: User | null = {
    id_user: 0,
    usuario: '',
    password: ''
  };


  constructor(private router: Router, private _userService: ServiceUserService) { }

  ngOnInit() {
    // Se obtiene el user seteado en el User Service
    this._userService.user$.subscribe(user => {
      this.user = user;
      console.log('Usuario en home:', this.user);
    });
  }

}
