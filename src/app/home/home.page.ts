import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user/user';
import { PerfilUsuario } from '../models/perfil-usuario';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  user!: PerfilUsuario;

  constructor(private router: Router) { }

  ngOnInit() {
    //Se obtiene el usuario enviado al navegar desde página login hacia home con la función login()
    this.user = this.router.getCurrentNavigation()?.extras?.state?.['user'];
    console.info(this.user);
  }

  verPerfil() {
    //Se redirecciona a la página perfil-usuario enviando el usuario
    console.log("Antes de enviar de home a perfil"+JSON.stringify(this.user))
    this.router.navigate(['perfil-usuario'], {
      state: {
        usuario: this.user
      }
    })

  }

}
