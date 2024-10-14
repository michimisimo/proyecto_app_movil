import { Component, OnInit } from '@angular/core';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { Router } from '@angular/router';
import { GetUser } from 'src/app/models/user/get_user';
import { ServiceUsuarioService } from 'src/app/api/service_usuario/service-usuario.service';
import { ServiceRolService } from 'src/app/api/service_rol/service-rol.service';
import { Rol } from 'src/app/models/rol';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {

  user!: GetUser;

  perfilUsuario: PerfilUsuario = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: ''
  };

  rol : Rol ={
    id: 0,
    nombre: ''
  };

  constructor(private router: Router, private _usuarioService: ServiceUsuarioService, private _rolService : ServiceRolService) { }

  ngOnInit() {
    //Se obtiene el usuario enviado al navegar desde página login hacia home con la función login()
    this.user = this.router.getCurrentNavigation()?.extras?.state?.['usuario'];
    console.log("En perfil-usuario"+JSON.stringify(this.user));
    this.obtenerPerfilUsuario();
    
  }

  obtenerPerfilUsuario(){
    this._usuarioService.getUsuarioByIdUser(this.user.id_user).subscribe({
      next: (response) =>{
        if(response.body!= null)
          this.perfilUsuario=response.body[0];
        this.obtenerRolUsuario();
      },
      error: (err) => {
        console.error('Error al cargar el perfil del usuario', err);
      }      
    })
  }

  obtenerRolUsuario(){
    if (this.perfilUsuario.ID_rol){
      this.rol.id = this.perfilUsuario.ID_rol
      this._rolService.getRolById(this.perfilUsuario.ID_rol).subscribe({
        next: (response) =>{
          if(response.body!=null)
            this.rol=response.body[0];
            console.log("Nombre rol:"+this.rol.nombre);
        },
        error: (err) => {
          console.error('Error al obtener nombre del rol', err);
        }      
      })
    } 
  } 
    

  

  irHome(){
    this.router.navigate(['home']);
  }
}
