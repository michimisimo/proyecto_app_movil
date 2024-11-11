import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { Evento } from 'src/app/models/evento';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { InvitacionEvento } from 'src/app/models/invitacion_evento';
import { ServiceInvitacionEventoService } from 'src/app/api/service_invitacion_evento/service-invitacion-evento.service';
import { ServiceFotoEventoService } from 'src/app/api/service_foto_evento/service-foto-evento.service';
import { FotoEvento } from 'src/app/models/foto_evento';
import { ServiceImageService } from 'src/app/api/service_image/service-image.service';
import { environment } from 'src/environments/environment';
import { Tag } from 'src/app/models/tag';
import { ServiceTagService } from 'src/app/api/service_tag/service-tag.service';
import { TagEvento } from 'src/app/models/tag_evento';
import { ServiceEventoTagService } from 'src/app/api/service_evento_tag/service-evento-tag.service';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
})
export class EventoPage implements OnInit {

  evento: Evento = {
    id_evento: 0,
    nombre: '',
    descripcion: '',
    fecha: new Date(),
    ubicacion: '',
    id_creador: 0
  };

  foto_evento: FotoEvento = {
    id_evento: 0,
    url_foto_evento: ''
  }

  perfilUsuario: PerfilUsuario = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    id_user: 0,
    url_foto: null,
  };

  listaTags: Tag[] = [];
  nombreCreador: string = '';
  listaEventos: Evento[] = [];
  listaFotosEvento: FotoEvento[] = [];
  listaInvitaciones: InvitacionEvento[] = [];
  listaInvitados: PerfilUsuario[] = [];
  listaTagsEvento: TagEvento[] = [];
  usuarioRole: Boolean = false;

  //Tomar foto con la cámara
  fotoTomada: string | undefined;

  constructor(
    private router: Router,
    private _eventoService: ServiceEventoService,
    private _perfilUsuarioService: ServicePerfilUsuarioService,
    private _invitacionService: ServiceInvitacionEventoService,
    private _fotoEventoService: ServiceFotoEventoService,
    private _imageService: ServiceImageService,
    private _tagService: ServiceTagService,
    private _tagEventoService: ServiceEventoTagService,
    private alertController: AlertController) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this._perfilUsuarioService.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.perfilUsuario = usuario;
      }
      console.log('Usuario en Evento:', usuario);
    });
    if (navigation && navigation.extras.state) {
      console.log("Id evento por navegacion: " + navigation.extras.state['id'])
      this.evento.id_evento = navigation.extras.state['id'];
      console.log('ID del evento:', this.evento.id_evento);
      this.obtenerEvento();
      this.obtenerListaFotosEvento();
    }
  }

  obtenerEvento() {
    if (this.evento.id_evento) {
      this._eventoService.getEventoById(this.evento.id_evento).subscribe({
        next: (response) => {
          if (response.body) {
            this.evento = response.body[0];
            this.obtenerNombreCreador(this.evento.id_creador!);
            this.obtenerTagsEvento(this.evento.id_evento!);
            this.obtenerInvitados(this.evento.id_evento!)
            console.log("Evento:" + JSON.stringify(this.evento));
          }
        }
      })
    }
  }

  obtenerListaFotosEvento() {
    if (this.evento.id_evento) {
      this._fotoEventoService.getFotoEventoByIdEvento(this.evento.id_evento).subscribe({
        next: (response) => {
          if (response.body) {
            this.listaFotosEvento = response.body;
            console.log("Lista de fotos:", this.listaFotosEvento); // Verifica que las fotos se carguen correctamente
          } else {
            console.log("No se encontraron fotos para este evento.");
          }
        },
        error: (err) => {
          console.error("Error al obtener fotos:", err);
        }
      });
    }
  }

  abrirSelectorDeArchivos() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  subirImagenes(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files) {
      const archivos = Array.from(fileInput.files); // Convierte a un array

      archivos.forEach(archivo => {
        // Maneja la subida de cada archivo
        if (this.evento.id_evento) {
          this._imageService.uploadImage('eventos', 'evento', this.evento.id_evento, archivo).subscribe(
            (response) => {
              console.log('Imagen subida con éxito:', response);
              const url = `${environment.storage_url}object/public/eventos/evento-${this.evento.id_evento}/${archivo.name}`;
              // Aquí se puede hacer algo con la URL, como agregarla a una lista
              console.log('URL de la imagen:', url);
              if (this.evento.id_evento) {
                this.foto_evento.id_evento = this.evento.id_evento;
                this.foto_evento.url_foto_evento = url;
                this._fotoEventoService.createFotoEvento(this.foto_evento).subscribe(
                  (response) => {
                    console.log("Foto del evento subida con éxito")
                    this.obtenerListaFotosEvento();
                  }, error => {
                    console.error('Error al subir foto del evento', error);
                  });
              }

            },
            (error) => {
              console.error('Error al subir la imagen:', error);
            }
          );
        }

      });
    }
  }

  obtenerNombreCreador(id_creador: number) {
    // Realiza la llamada para obtener el perfil del creador
    this._perfilUsuarioService.getPerfilUsuarioById(id_creador).subscribe({
      next: (Response) => {
        const creadores: PerfilUsuario[] = Response.body || [];
        const creador = creadores[0];
        const nombreCompleto = `${creador.nombre} ${creador.apellido}`;
        // Guarda en cache el resultado para evitar futuras llamadas

        this.nombreCreador = nombreCompleto;

      },
      error: (error) => {
        console.log('Error al obtener el creador');
      }
    });
  }

  obtenerInvitados(eventoId: number): void {
    console.log('ejecutando funcion para invitados')
    // Inicializa la lista de invitados vacía
    this.listaInvitados = [];

    // Obtiene las invitaciones del evento
    this._invitacionService.getInvitacionByEventoId(eventoId).subscribe({
      next: (Response) => {
        this.listaInvitaciones = (Response.body || [])
          .filter(invitacion => invitacion.id_estado === 1); // Filtra los invitados confirmados

        console.log(this.listaInvitaciones)

        this.listaInvitaciones.forEach(invitacion =>
          this._perfilUsuarioService.getPerfilUsuarioById(invitacion.id_invitado).subscribe({
            next: (Response) => {
              const invitado: PerfilUsuario = (Response.body![0])
              this.listaInvitados.push(invitado)
            }
          })
        );

      },
      error: (err) => {
        console.error('Error al obtener invitaciones del evento', err);
      }
    });
  }

  irHome() {
    this.router.navigate(['home']);
  }

  irGaleria() {
    this.router.navigate(['galeria-evento'], {
      state: { idEvento: this.evento.id_evento }
    });
  }

  obtenerTagsEvento(id_evento: number) {
    this.listaTagsEvento = [];
    this.listaTags = []; // Inicializar la lista de tags

    this._tagEventoService.getTagsByEvento(id_evento).subscribe({
      next: (response) => {
        this.listaTagsEvento = response.body || []; // Usar un valor por defecto si no hay body
        console.log('tags evento:', this.listaTagsEvento);

        const tagRequests = this.listaTagsEvento.map(tag =>
          this._tagService.getTagById(tag.id_tag).toPromise()
        );

        Promise.all(tagRequests).then(tags => {
          // Aplanar los resultados
          this.listaTags = tags.map(res => res!.body!).flat();
          console.log('lista tags:', this.listaTags);
        }).catch(err => {
          console.error('Error al obtener las etiquetas:', err);
        });
      },
      error: (err) => {
        console.error('Error al obtener los tags del evento:', err);
      }
    });
  }

  async irEditarEvento() {
    // Validar si la persona logueada es creador del evento y asignar permisos de admin
    if (this.evento.id_creador == this.perfilUsuario.id_persona) {
      this.usuarioRole = true;
    } else {
      // Obtener el rol de la persona logueada si no es creador
      if (this.perfilUsuario.id_persona) {
        this.usuarioRole = this.isAdmin(this.perfilUsuario.id_persona);
        if (this.usuarioRole === false) {
          console.log("No tienes permisos para acceder a la página editar-evento");
          await this.mostrarAlerta("No tienes permisos para acceder a la página editar-evento");
          return; // Salir de la función si no tiene permisos
        }
      }
    }

    await Preferences.set({
      key: 'info',
      value: JSON.stringify({ role: this.usuarioRole }) // Enviar true si es admin
    });

    console.log("Id evento antes de enviar a page editar-evento: " + this.evento.id_evento);
    this.router.navigate(['editar-evento'], {
      state: { idEvento: this.evento.id_evento }
    });
    }

    async mostrarAlerta(mensaje: string) {
      const alert = await this.alertController.create({
        header: 'Acceso Denegado',
        message: mensaje,
        buttons: ['Aceptar']
      });
      await alert.present();
  }
  

  darAdmin(id_invitado: number) {
    const invitacion = this.listaInvitaciones.filter(invitacion => invitacion.id_invitado == id_invitado)
    this._invitacionService.updateRol(invitacion[0].id_invitacion, 1).subscribe({
      next: (Response) => {
        console.log('se actualizo el rol a admin para el usuario: ', invitacion[0].id_invitado)
        this.obtenerInvitados(this.evento.id_evento!);
      },
      error: (error) => {
        console.log('error al dar rol admin a usuario: ', invitacion[0].id_invitado)
      }
    })
  }

  quitarAdmin(id_invitado: number) {
    const invitacion = this.listaInvitaciones.filter(invitacion => invitacion.id_invitado == id_invitado)
    this._invitacionService.updateRol(invitacion[0].id_invitacion, 2).subscribe({
      next: (Response) => {
        console.log('se actualizo el rol a invitado para el usuario: ', invitacion[0].id_invitado)
        this.obtenerInvitados(this.evento.id_evento!);
      },
      error: (error) => {
        console.log('error al quitar rol admin a usuario: ', invitacion[0].id_invitado)
      }
    })
  }

  isAdmin(id_invitado: number): Boolean {
    const invitacion = this.listaInvitaciones.filter(invitacion => invitacion.id_invitado == id_invitado)
    return invitacion[0].id_rol == 1;
  }

  // Función para abrir la cámara y tomar la foto
  async tomarFoto() {
    try {
      const foto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,  // Obtener la foto como Data URL
        source: CameraSource.Camera,  // Usar la cámara para capturar la foto
        quality: 100  // Calidad de la imagen (0-100)
      });
  
      // Convertir el DataUrl a un archivo (File)
      if (foto.dataUrl){
        const date = new Date().toISOString().replace(/[:.-]/g, '');
        const fileName = `foto_${date}.jpg`;
        const imagenFile = this.convertirDataUrlAFile(foto.dataUrl, fileName);

        // Asigna la foto tomada a la variable
        this.fotoTomada = foto.dataUrl;
    
        // Subir la imagen como un archivo
        this.subirFoto(imagenFile);
      }     
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

  convertirDataUrlAFile(dataUrl: string, nombreArchivo: string): File {
    const byteString = atob(dataUrl.split(',')[1]);  // Decodifica el Data URL
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
  
    // Copiar los datos decodificados a un array de bytes
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
  
    // Crear un archivo a partir del array de bytes
    const archivo = new File([uintArray], nombreArchivo, { type: 'image/jpeg' });  // Asume que es JPEG, ajusta si es otro formato
    return archivo;
  }

  // Función para subir la foto (modificar según tu lógica de subida)
  subirFoto(foto: File) {
    if (this.evento.id_evento) {
      this._imageService.uploadImage('eventos', 'evento', this.evento.id_evento, foto).subscribe(
        (response) => {
          console.log('Imagen subida con éxito:', response);
          
          const url = `${environment.storage_url}object/public/eventos/evento-${this.evento.id_evento}/${foto.name}`;
          this.foto_evento.id_evento = this.evento.id_evento!;
          this.foto_evento.url_foto_evento = url;
          
          this._fotoEventoService.createFotoEvento(this.foto_evento).subscribe(
            (response) => {
              console.log("Foto del evento subida y registrada con éxito");
            }, 
            error => {
              console.error('Error al registrar la foto del evento', error);
            }
          );
          
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
        }
      );
    }
  }

}
