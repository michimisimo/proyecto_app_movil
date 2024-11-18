import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { Evento } from 'src/app/models/evento';
import { Tag } from 'src/app/models/tag';
import { TagEvento } from 'src/app/models/tag_evento';
import { ServiceEventoTagService } from 'src/app/api/service_evento_tag/service-evento-tag.service';
import { ServiceTagService } from 'src/app/api/service_tag/service-tag.service';
import { forkJoin, Observable } from 'rxjs';
import { Map, Marker } from 'mapbox-gl';
import { MapboxService } from 'src/app/api/service_mapbox/service-mapbox.service';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';
import { Ubicacion } from 'src/app/models/ubicacion';
import { ServiceUbicacionService } from 'src/app/api/service_ubicacion/service-ubicacion.service';


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
    id_ubicacion: 0
  };

  ubicacion_evento: Ubicacion = {
    id_ubicacion: 0,
    direccion: '',
    latitud: 0,
    longitud: 0
  }


  listaTagsSeleccionados: Tag[] = [];
  listaTagsActivos: Tag[] = [];
  listaEventoTag: TagEvento[] = [];
  listaTags: Tag[] = [];
  eventoEdicion: Evento = { ...this.evento }; // Copia para edición
  isEditing: boolean = true;

  mapa!: Map;
  marcador!: Marker;
  addresses: string[] = []; // Lista de direcciones sugeridas

  nuevaUbicacion: Ubicacion = {
    direccion: '',
    latitud: 0,
    longitud: 0
  };

  coordenadasIniciales = {
    "lng": 0,
    "lat": 0
  };

  @ViewChild('map') map!: ElementRef;

  constructor(
    private router: Router,
    private _eventoService: ServiceEventoService,
    private alertController: AlertController,
    private _tagService: ServiceTagService,
    private _tagEventoService: ServiceEventoTagService,
    private _mapboxService: MapboxService,
    private _ubicacionService: ServiceUbicacionService
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

  iniciarMapa(lng: number, lat: number) {

    const container = document.getElementById('mapaEditar');
    if (container) {
      container.innerHTML = ''; // Limpia el contenedor
    }

    this.mapa = new Map({
      container: 'mapaEditar',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat], // Coordenadas iniciales
      zoom: 17,
      accessToken: environment.mapbox_Key
    });
    this.marcador = new Marker().setLngLat([lng, lat]).addTo(this.mapa);
  }

  obtenerEvento() {
    if (this.evento.id_evento) {
      this._eventoService.getEventoById(this.evento.id_evento).subscribe({
        next: (response) => {
          if (response.body) {
            this.evento = response.body[0];
            this.obtenerTagsEvento()
            this.obtenerUbicacionEvento(this.evento.id_ubicacion);
            this.eventoEdicion = { ...this.evento }; // Inicializa la copia para editar
          }
        },
      });
    }
  }

  async actualizarEvento() {
    if (this.evento.id_evento) {
      try {
        // Esperar a que se eliminen y agreguen los tags
        await forkJoin([this.eliminarTags(), this.agregarTags()]).toPromise();

        // Crear o buscar la ubicación y obtener su ID
        const idUbicacion = await this.crearEventoConUbicacion();
        this.eventoEdicion.id_ubicacion = idUbicacion!;

        // Actualizar el evento con el ID de la ubicación
        const id = this.evento.id_evento!.toString();
        await this._eventoService.updateEvento(id, this.eventoEdicion).toPromise();

        console.log('Evento actualizado con éxito');
        this.evento = { ...this.eventoEdicion }; // Actualiza el evento con los nuevos datos
        this.isEditing = false; // Termina la edición
        this.irHome();
      } catch (error) {
        console.error('Error al actualizar el evento:', error);
      }
    } else {
      console.log('El ID de evento no está definido');
    }
  }

  revertirCambios() {
    this.eventoEdicion = { ...this.evento }; // Restablece la copia a los datos originales
    this.isEditing = false; // Termina la edición
    if (this.marcador) {
      this.marcador.remove();
    }
    this.mapa.setCenter([this.coordenadasIniciales.lng, this.coordenadasIniciales.lat])
    this.marcador = new Marker().setLngLat([this.coordenadasIniciales.lng, this.coordenadasIniciales.lat]).addTo(this.mapa);
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

  search(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    if (searchTerm) {
      this._mapboxService.searchAddress(searchTerm).subscribe({
        next: (response) => {
          this.addresses = response.features.map((feature: any) => feature.place_name);
        },
        error: (err) => {
          console.error('Error al buscar direcciones', err);
          this.addresses = [];  // Vaciar la lista si hay un error
        },
      });
    } else {
      this.addresses = []; // Vaciar la lista si no hay término de búsqueda
    }
  }

  onSelect(address: string) {
    console.log('Dirección seleccionada:', address);

    this.eventoEdicion.ubicacion = address;

    this._mapboxService.getCoordinates(address).subscribe(
      (coordenadas: { lng: number, lat: number }) => { // Asegúrate de que las coordenadas sean del tipo adecuado
        console.log('Coordenadas obtenidas: ', coordenadas);

        if (!coordenadas || typeof coordenadas.lng !== 'number' || typeof coordenadas.lat !== 'number') {
          console.error('Coordenadas inválidas:', coordenadas);
          return;
        }

        if (this.marcador) {
          this.marcador.remove();
        }


        this.mapa.setCenter([coordenadas.lng, coordenadas.lat]);
        this.mapa.setZoom(17);

        this.marcador = new Marker().setLngLat([coordenadas.lng, coordenadas.lat]).addTo(this.mapa);

        this.map.nativeElement.style.display = 'flex';

        this.nuevaUbicacion.direccion = this.eventoEdicion.ubicacion;
        this.nuevaUbicacion.latitud = coordenadas.lat;
        this.nuevaUbicacion.longitud = coordenadas.lng;
        console.log('ubicacion para BD: ', this.nuevaUbicacion)

      },
      (error) => {
        console.error('Error al obtener las coordenadas:', error);
      }
    );

    this.addresses = [];

  }

  async checkAndRequestPermissions() {
    const permissions = await Geolocation.checkPermissions();
    if (permissions.location === 'granted') {
      return true;
    } else {
      await Geolocation.requestPermissions();
      return (await Geolocation.checkPermissions()).location === 'granted';
    }
  }

  async getCurrentLocation() {
    if (await this.checkAndRequestPermissions()) {
      try {
        const coordenadas = await Geolocation.getCurrentPosition();
        this.nuevaUbicacion.latitud = parseFloat(coordenadas.coords.latitude.toFixed(6));
        this.nuevaUbicacion.longitud = parseFloat(coordenadas.coords.longitude.toFixed(6));

        // Usa el servicio para obtener la dirección
        this._mapboxService.getAddressFromCoordinates(this.nuevaUbicacion.latitud, this.nuevaUbicacion.longitud).subscribe(
          (address: string) => {

            this.nuevaUbicacion.direccion = address;
            this.eventoEdicion.ubicacion = address;

            if (this.marcador) {
              this.marcador.remove();
            }

            this.mapa.setCenter([this.nuevaUbicacion.longitud, this.nuevaUbicacion.latitud])
            this.mapa.setZoom(17);
            this.marcador = new Marker().setLngLat([this.nuevaUbicacion.longitud, this.nuevaUbicacion.latitud]).addTo(this.mapa);
            this.map.nativeElement.style.display = 'flex';

            console.log('ubicacion para BD: ', this.nuevaUbicacion)

          },
          (error: Error) => {
            console.error('Error al obtener la dirección:', error);
          }
        );
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
      }
    } else {
      console.error('Permiso de ubicación denegado.');
    }
  }

  obtenerUbicacionEvento(id: number) {
    this._ubicacionService.getUbicacionById(id).subscribe({
      next: (Response) => {
        this.ubicacion_evento = Response.body![0];
        console.log('ubicacion evento: ', this.ubicacion_evento)
        this.coordenadasIniciales = {
          'lng': this.ubicacion_evento.longitud,
          'lat': this.ubicacion_evento.latitud
        }
        this.iniciarMapa(this.ubicacion_evento.longitud, this.ubicacion_evento.latitud)
      }
    })
  }

  async crearEventoConUbicacion(): Promise<number> {
    try {
      // Intentar obtener el ID de la ubicación existente
      const ubicacionExistente = await this._ubicacionService.getIdUbicacion(
        this.nuevaUbicacion.direccion,
        this.nuevaUbicacion.latitud,
        this.nuevaUbicacion.longitud
      ).toPromise();

      if (ubicacionExistente!.body && ubicacionExistente!.body.length > 0) {
        console.log('Ubicación existente encontrada:', ubicacionExistente!.body[0]);
        return ubicacionExistente!.body[0].id_ubicacion!;
      }

      // Crear nueva ubicación si no existe
      console.log('Ubicación no encontrada, creando una nueva...');
      await this._ubicacionService.createUbicacion(this.nuevaUbicacion).toPromise();

      // Obtener nuevamente el ID de la ubicación creada
      const nuevaUbicacion = await this._ubicacionService.getIdUbicacion(
        this.nuevaUbicacion.direccion,
        this.nuevaUbicacion.latitud,
        this.nuevaUbicacion.longitud
      ).toPromise();

      if (nuevaUbicacion!.body && nuevaUbicacion!.body.length > 0) {
        console.log('Nueva ubicación creada con ID:', nuevaUbicacion!.body[0].id_ubicacion);
        return nuevaUbicacion!.body[0].id_ubicacion!;
      }

      throw new Error('No se pudo obtener o crear la ubicación.');
    } catch (error) {
      console.error('Error al crear o obtener la ubicación:', error);
      throw error;
    }
  }


}
