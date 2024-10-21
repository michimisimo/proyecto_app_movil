import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { ServiceImageService } from 'src/app/api/service_image/service-image.service';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { Evento } from 'src/app/models/evento';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
})
export class CrearEventoPage implements OnInit {

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
    url_foto_portada: null 
  };

  selectedImage: File | null = null;

  constructor(
    private router: Router, 
    private _perfilUsuarioService: ServicePerfilUsuarioService, 
    private _eventoService: ServiceEventoService,
    private _imageService: ServiceImageService
  ) { }

  ngOnInit() {
    this._perfilUsuarioService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.perfilUsuario = usuario;
      }      
      console.log('Usuario en crear-evento:', this.perfilUsuario);
    });
  }

  adjuntarFotoPortada(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedImage = target.files[0];
      console.log('Imagen seleccionada:', this.selectedImage);
    }
  }

  crearEvento() {
    if (this.perfilUsuario.id_persona) {
      this.evento.id_creador = this.perfilUsuario.id_persona;
    }
  
    console.log("Evento: ", JSON.stringify(this.evento));
  
    // Si hay una imagen seleccionada, primero se sube la imagen
    if (this.selectedImage) {
      this.subirFotoPortada(this.selectedImage).then(url => {
        // Se almacena la URL de la imagen en el evento
        this.evento.url_foto_portada = url;
  
        // Se crea el evento con la URL de la imagen
        this._eventoService.createEvento(this.evento).subscribe(response => {
          console.log('Evento creado con éxito', response);
        }, error => {
          console.error('Error al crear el evento', error);
        });
      }).catch(error => {
        console.error('Error al subir la imagen de portada:', error);
      });
    } else {
      // Si no hay imagen, crea el evento sin URL
      this._eventoService.createEvento(this.evento).subscribe(response => {
        console.log('Evento creado con éxito', response);
      }, error => {
        console.error('Error al crear el evento', error);
      });
    }
  }
  
  subirFotoPortada(image: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this._imageService.uploadImage('portadas-eventos', 'evento', this.evento.id_creador, image).subscribe(
        (response) => {
          console.log('Imagen de portada subida con éxito:', response);
          const url = `${environment.storage_url}object/public/portadas-eventos/evento-${this.evento.id_creador}/${image.name}`;
          resolve(url);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }  

  irHome() {
    this.router.navigate(['home']);
  }
}
