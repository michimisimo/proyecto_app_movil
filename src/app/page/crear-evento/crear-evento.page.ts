import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Map, Marker } from 'mapbox-gl';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { ServiceImageService } from 'src/app/api/service_image/service-image.service';
import { ServicePerfilUsuarioService } from 'src/app/api/service_perfil_usuario/service-perfil-usuario.service';
import { Evento } from 'src/app/models/evento';
import { PerfilUsuario } from 'src/app/models/perfil-usuario';
import { environment } from 'src/environments/environment';
import { MapboxService } from 'src/app/api/service_mapbox/service-mapbox.service';
import { Geolocation } from '@capacitor/geolocation';
import { Ubicacion } from 'src/app/models/ubicacion';
import { ServiceUbicacionService } from 'src/app/api/service_ubicacion/service-ubicacion.service';


@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
})
export class CrearEventoPage implements OnInit, AfterViewInit {

  @ViewChild('map') map!: ElementRef;

  perfilUsuario: PerfilUsuario = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    id_user: 0,
  };

  evento: Evento = {
    nombre: '',
    descripcion: '',
    fecha: new Date(),
    ubicacion: '',
    id_creador: 0,
    url_foto_portada: null,
    id_ubicacion: 0
  };

  ubicacion: Ubicacion = {
    direccion: '',
    latitud: 0,
    longitud: 0
  }

  mapa!: Map;
  marcador!: Marker;
  selectedImage: File | null = null;
  addresses: string[] = []; // Lista de direcciones sugeridas

  coordinates = {
    "lng": 0,
    "lat": 0
  };

  constructor(
    private router: Router,
    private _perfilUsuarioService: ServicePerfilUsuarioService,
    private _eventoService: ServiceEventoService,
    private _imageService: ServiceImageService,
    private _mapboxService: MapboxService,
    private _ubicacionService: ServiceUbicacionService
  ) { }

  ngOnInit() {
    this._perfilUsuarioService.usuario$.subscribe((usuario) => {
      if (usuario) {
        this.perfilUsuario = usuario;
      }
      console.log('Usuario en crear-evento:', this.perfilUsuario);
    });
  }

  ngAfterViewInit() {
    if (this.map.nativeElement) {
      this.iniciarMapa(this.coordinates);
    } else {
      console.error('El contenedor del mapa no está disponible.');
    }
  }


  iniciarMapa(coordenadas: typeof this.coordinates) {

    const container = document.getElementById('mapaCrear');
    if (container) {
      container.innerHTML = ''; // Limpia el contenedor
    }

    this.mapa = new Map({
      container: 'mapaCrear',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [coordenadas.lng, coordenadas.lat], // Coordenadas iniciales
      zoom: 17,
      accessToken: environment.mapbox_Key
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
    // Verificamos que el ID del creador esté presente
    if (this.perfilUsuario.id_user) {
      this.evento.id_creador = this.perfilUsuario.id_persona!;
    }

    // Verificamos si hay campos vacíos o nulos en el evento
    if (this.evento.nombre === '' || this.evento.ubicacion === '' || this.evento.descripcion === '') {
      console.log('Hay datos en null');
      return;
    }

    // Logueamos el cuerpo del evento para asegurarnos de que todos los datos están correctos
    console.log('Cuerpo del evento antes de enviar:', JSON.stringify(this.evento));

    if (this.selectedImage) {
      // Si hay una imagen seleccionada, la subimos primero
      this.subirFotoPortada(this.selectedImage).then((url) => {
        this.evento.url_foto_portada = url;
        this.crearEventoConUbicacion();  // Llamamos a la función para crear el evento con la foto subida
      });
    } else {
      this.crearEventoConUbicacion();  // Si no hay imagen, llamamos directamente a la función para crear el evento
    }
  }


  crearEventoConUbicacion() {
    // Intentamos obtener el ID de la ubicación de la base de datos
    this._ubicacionService.getIdUbicacion(this.ubicacion.direccion, this.ubicacion.latitud, this.ubicacion.longitud).subscribe({
      next: async (response) => {
        // Logueamos la respuesta completa para ver qué estamos recibiendo
        console.log('Respuesta de la API para la ubicación:', response);

        // Verificamos que la respuesta tenga datos
        if (response.body && response.body.length > 0) {
          // Si la respuesta contiene datos, obtenemos el ID de la ubicación
          const ubicacion = response.body![0]; // Obtenemos el primer elemento si es un array
          this.evento.id_ubicacion = ubicacion.id_ubicacion!;
          console.log('ID de ubicación obtenido:', this.evento.id_ubicacion);
          this.crearEventoAsync();

        } else {

          console.log('No se encontró una ubicación para los parámetros dados. Se creará una nueva ubicación.');

          await this._ubicacionService.createUbicacion(this.ubicacion).subscribe({
            next: async (response) => {

              await this._ubicacionService.getIdUbicacion(this.ubicacion.direccion, this.ubicacion.latitud, this.ubicacion.longitud).subscribe({
                next: (response) => {

                  console.log('Respuesta de la API para la ubicación:', response);
                  const ubicacion = response.body![0]; // Obtenemos el primer elemento si es un array
                  this.evento.id_ubicacion = ubicacion.id_ubicacion!;
                  console.log('ID de ubicación creada:', this.evento.id_ubicacion);
                  this.crearEventoAsync();
                }
              })

            },
            error: (error) => {
              console.error('Error al crear ubicación:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener el ID de la ubicación:', error);
        // Si hay un error en la búsqueda de la ubicación, no intentamos crear el evento
      },
    });
  }


  async crearEventoAsync() {
    try {
      // Verificamos si tenemos el ID de ubicación
      if (this.evento.id_ubicacion) {
        console.log('Cuerpo del evento antes de enviar:', JSON.stringify(this.evento));  // Verificamos los datos del evento

        // Creamos el evento en la base de datos
        const response = await this._eventoService.createEvento(this.evento).toPromise();

        console.log('Evento creado con éxito', response);
        this.irMisEventos();
      } else {
        console.error('Error: No se pudo asignar el ID de ubicación al evento.');
      }
    } catch (error) {
      console.error('Error al crear el evento:', error);
      if (error) {
        console.error('Detalles del error:', error);  // Muestra el detalle del error desde el servidor
      }
    }
  }


  subirFotoPortada(image: File): Promise<string> {
    return new Promise((resolve, reject) => {
      this._imageService.uploadImage('portadas-eventos', 'perfil', this.evento.id_creador, image).subscribe(
        (response) => {
          console.log('Imagen de portada subida con éxito:', response);
          const url = `${environment.storage_url}object/public/portadas-eventos/perfil-${this.evento.id_creador}/${image.name}`;
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

  irMisEventos() {
    this.router.navigate(['mis-eventos']);
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
    this.evento.ubicacion = address;

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

        this.ubicacion.direccion = this.evento.ubicacion;
        this.ubicacion.latitud = coordenadas.lat;
        this.ubicacion.longitud = coordenadas.lng;
        console.log('ubicacion para BD: ', this.ubicacion)

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
        const latitude = parseFloat(coordenadas.coords.latitude.toFixed(6));
        const longitude = parseFloat(coordenadas.coords.longitude.toFixed(6));
        this.coordinates = { lng: longitude, lat: latitude }
        // Usa el servicio para obtener la dirección
        this._mapboxService.getAddressFromCoordinates(latitude, longitude).subscribe(
          (address: string) => {

            if (this.marcador) {
              this.marcador.remove();
            }

            this.evento.ubicacion = address; // Actualiza el ion-input con la dirección

            this.mapa.setCenter(this.coordinates)
            this.mapa.setZoom(17);
            this.marcador = new Marker().setLngLat([this.coordinates.lng, this.coordinates.lat]).addTo(this.mapa);
            this.map.nativeElement.style.display = 'flex';

            this.ubicacion.direccion = this.evento.ubicacion;
            this.ubicacion.latitud = this.coordinates.lat;
            this.ubicacion.longitud = this.coordinates.lng;
            console.log('ubicacion para BD: ', this.ubicacion)

            console.log('Dirección obtenida:', address);
          },
          (error) => {
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

}
