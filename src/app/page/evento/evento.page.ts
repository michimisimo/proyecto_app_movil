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

  nombreCreador: string = '';
  listaEventos: Evento[] = [];
  listaFotosEvento: FotoEvento[] = [];
  listaInvitaciones: InvitacionEvento[] = [];
  listaInvitados: PerfilUsuario[] = [];


  constructor(
    private router: Router,
    private _eventoService: ServiceEventoService,
    private _perfilUsuarioService: ServicePerfilUsuarioService,
    private _invitacionService: ServiceInvitacionEventoService,
    private _fotoEventoService: ServiceFotoEventoService,
    private _imageService: ServiceImageService) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
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
              // Aquí puedes hacer algo con la URL, como agregarla a una lista
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
        const listaInvitaciones = (Response.body || [])
          .filter(invitacion => invitacion.id_estado === 1); // Filtra los invitados confirmados

        console.log(listaInvitaciones)

        listaInvitaciones.forEach(invitacion =>
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

}
