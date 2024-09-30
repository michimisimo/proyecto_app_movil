import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceUserService {

  perfilUsuario: PerfilUsuario= {
    user: {
      usuario: "",
      password: ""
    },
    rol: {
      id: 0,
      nombre: ""
    },
    nombre: "",
    apellido: "",
    correo: "",
    telefono: ""  
  }

  constructor(private httpClient: HttpClient) { }

  private lista_usuarios:PerfilUsuario[] = [

    {
      "user": {
        "usuario": "juana_perez",
        "password": "8f4fbce9bfbf6b8add1adb03d1e52d71de916a4f702c24ba767d76edf0d48188"
        //password: Juana123
      },
      "rol": {
        "id": 1,
        "nombre": "Admin"
      },
      "nombre": "Juana",
      "apellido": "Pérez",
      "correo": "juanaperez@mail.com",
      "telefono": "987654321"
    },
    {
      "user": {
        "usuario": "pedro_lopez",
        "password": "21ad88d02651f2190772566834b6bcc8c1bcc0915f448d4d645c35bb9a79759b"
        //password: Pedro123
      },
      "rol": {
        "id": 2,
        "nombre": "Invitado"
      },
      "nombre": "Pedro",
      "apellido": "López",
      "correo": "pedrolopez@mail.com",
      "telefono": "912345678"
    },
    {
      "user": {
        "usuario": "luisa_silva",
        "password": "a947ca626f1a19f8f4ec1c0f6ad1141805c660d65517e4f8b9a2018f4bfa0058"
        //password: Luisa123
      },
      "rol": {
        "id": 2,
        "nombre": "Invitado"
      },
      "nombre": "Luisa",
      "apellido": "Silva",
      "correo": "luisasilva@mail.com",
      "telefono": "998765432"
    },

  ]

  agregar_usuario(usuario: PerfilUsuario){
    this.lista_usuarios.push(usuario);
    console.info(usuario)
    console.info(this.lista_usuarios)
  }

  encontrar_usuario(user: User) : PerfilUsuario {
    console.info(this.lista_usuarios)
    //Se recorre la lista de usuarios hasta que el usuario y password coincidan
    for (let i = 0; i < this.lista_usuarios.length; i++){
      if (this.lista_usuarios[i].user.usuario == user.usuario && this.lista_usuarios[i].user.password === user.password) {
        this.perfilUsuario = this.lista_usuarios[i]
      }
    }
    //Se retorna un usuario de tipo PerfilUsuario
    console.info(this.perfilUsuario)
    return this.perfilUsuario;
  }
 
}
