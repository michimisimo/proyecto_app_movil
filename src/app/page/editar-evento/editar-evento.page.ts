import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { Evento } from 'src/app/models/evento';
import { Tag } from 'src/app/models/tag';
import { TagEvento } from 'src/app/models/tag_evento';
import { ServiceEventoTagService } from 'src/app/api/service_evento_tag/service-evento-tag.service';
import { ServiceTagService } from 'src/app/api/service_tag/service-tag.service';
import { forkJoin, Observable } from 'rxjs';


@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.page.html',
  styleUrls: ['./editar-evento.page.scss'],
})
export class EditarEventoPage implements OnInit {
  evento: Evento = {
    id_evento: 0,
    nombre: '',
    descripcion: '',
    fecha: new Date(),
    ubicacion: '',
    id_creador: 0,
    deshabilitar: false,
  };

  listaTagsSeleccionados: Tag[] = [];
  listaTagsActivos: Tag[] = [];
  listaEventoTag: TagEvento[] = [];
  listaTags: Tag[] = [];
  eventoEdicion: Evento = { ...this.evento }; // Copia para edición
  isEditing: boolean = true;

  constructor(
    private router: Router,
    private _eventoService: ServiceEventoService,
    private alertController: AlertController,
    private _tagService: ServiceTagService,
    private _tagEventoService: ServiceEventoTagService
  ) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.evento.id_evento = navigation.extras.state['idEvento'];
      console.log('Id evento en editar-evento: ' + this.evento.id_evento);
      this.obtenerEvento();
      this.obtenerTags();
    }
  }

  obtenerEvento() {
    if (this.evento.id_evento) {
      this._eventoService.getEventoById(this.evento.id_evento).subscribe({
        next: (response) => {
          if (response.body) {
            this.evento = response.body[0];
            this.obtenerTagsEvento()
            this.eventoEdicion = { ...this.evento }; // Inicializa la copia para editar
          }
        },
      });
    }
  }

  actualizarEvento() {
    if (this.evento.id_evento) {
      const eliminar$ = this.eliminarTags();
      const agregar$ = this.agregarTags();

      // Espera a que ambas operaciones se completen
      forkJoin([eliminar$, agregar$]).subscribe({
        next: () => {
          const id = this.evento.id_evento!.toString();

          this._eventoService.updateEvento(id, this.eventoEdicion).subscribe(
            (response) => {
              console.log('Evento actualizado con éxito', response);
              this.evento = { ...this.eventoEdicion }; // Actualiza el evento con los nuevos datos
              this.isEditing = false; // Termina la edición
              this.irMisEventos();
            },
            (error) => {
              console.error('Error al actualizar el evento', error);
            }
          );
        },
        error: (error) => {
          console.error('Error al eliminar o agregar tags', error);
        }
      });
    } else {
      console.log('El ID de evento no está definido');
    }
  }

  revertirCambios() {
    this.eventoEdicion = { ...this.evento }; // Restablece la copia a los datos originales
    this.isEditing = false; // Termina la edición
  }

  eliminarEvento() {
    this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar este evento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Aceptar',
          handler: () => {
            if (this.evento.id_evento) {
              const id = this.evento.id_evento.toString();
              this.eventoEdicion.deshabilitar = true;
              this._eventoService.updateEvento(id, this.eventoEdicion).subscribe(
                (response) => {
                  console.log('Evento eliminado con éxito', response);
                  this.irMisEventos(); // Redirigir a "mis eventos"                               
                })

            }
          },
        },
      ],
    }).then(alert => alert.present());
  }

  irHome() {
    this.router.navigate(['home']);
  }

  irMisEventos() {
    this.router.navigate(['home']/* , { queryParams: { reload: true } } */);

  }

  obtenerTags() {
    this._tagService.getTags().subscribe({
      next: (response) => {
        this.listaTags = response.body || []; // Asegúrate de que sea un arreglo
        console.log('Todos los tags:', this.listaTags);
      },
      error: (error) => {
        console.error('Error al obtener los tags:', error);
      }
    });
  }

  obtenerTagsEvento() {
    this._tagEventoService.getTagsByEvento(this.evento.id_evento!).subscribe({
      next: (response) => {
        this.listaEventoTag = response.body || [];
        this.listaTagsActivos = this.listaTags.filter(tag =>
          this.listaEventoTag.some(eventoTag => eventoTag.id_tag === tag.id_tag)
        );
        console.log('Tags activos', this.listaTagsActivos);
      },
      error: (error) => {
        console.error('Error al obtener los tags del evento:', error);
      }
    });
  }

  TagSeleccionado(event: any) {
    this.listaTagsSeleccionados = event.detail.value || []; // Asegúrate de que sea un arreglo
    console.log('Tag seleccionado:', this.listaTagsSeleccionados);
  }

  agregarTags() {
    return new Observable((observer) => {
      const agregar: Tag[] = this.listaTagsSeleccionados.filter(tagSel =>
        !this.listaEventoTag.some(tagEve => tagEve.id_tag === tagSel.id_tag)
      );

      if (agregar.length === 0) {
        observer.next();
        observer.complete();
        return;
      }

      const requests = agregar.map(tag => {
        // Verificar si id_tag y id_evento están definidos
        if (tag.id_tag && this.evento?.id_evento) {
          const data = {
            id_tag: tag.id_tag,
            id_evento: this.evento.id_evento,
          };
          return this._tagEventoService.createTagEvento(data).toPromise();
        }
        // Retornar undefined si no se cumplen las condiciones
        return undefined;
      }).filter(Boolean); // Filtrar valores undefined

      if (requests.length === 0) {
        observer.next();
        observer.complete();
        return;
      }

      Promise.all(requests)
        .then(() => {
          console.log('Tags agregados con éxito');
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.error('Problemas al agregar tags', error);
          observer.error(error);
        });
    });
  }

  eliminarTags() {
    return new Observable((observer) => {
      if (this.listaEventoTag.length > 0) {
        const eliminar: TagEvento[] = this.listaEventoTag.filter(tagEve =>
          !this.listaTagsSeleccionados.some(tagSel => tagEve.id_tag === tagSel.id_tag)
        );

        if (eliminar.length === 0) {
          observer.next();
          observer.complete();
          return;
        }

        const requests = eliminar.map(tag =>
          this._tagEventoService.deleteTagEvento(tag.id_evento_tag).toPromise()
        );

        Promise.all(requests)
          .then(() => {
            console.log('Tags eliminados con éxito');
            observer.next();
            observer.complete();
          })
          .catch((error) => {
            console.error('Problemas al eliminar tags', error);
            observer.error(error);
          });
      } else {
        observer.next();
        observer.complete();
      }
    });
  }

}
