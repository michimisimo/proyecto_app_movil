import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { ServiceFotoEventoService } from 'src/app/api/service_foto_evento/service-foto-evento.service';
import { Evento } from 'src/app/models/evento';
import { FotoEvento } from 'src/app/models/foto_evento';

@Component({
  selector: 'app-galeria-evento',
  templateUrl: './galeria-evento.page.html',
  styleUrls: ['./galeria-evento.page.scss'],
})
export class GaleriaEventoPage implements OnInit {

  evento: Evento = {
    id_evento: 0,
    nombre: '',
    descripcion: '',
    fecha: new Date(),
    ubicacion: '',
    id_creador: 0,
    id_ubicacion: 0
  };

  listaFotosEvento: FotoEvento[] = [];

  constructor(
    private _eventoService: ServiceEventoService,
    private _fotoEventoService: ServiceFotoEventoService,
    private router: Router) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.evento.id_evento = navigation.extras.state['idEvento'];
      console.log('ID Evento en Galería Evento:', this.evento.id_evento);
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
            console.log("Lista de fotos:", this.listaFotosEvento);
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

  irHome() {
    this.router.navigate(['home']);
  }

}
