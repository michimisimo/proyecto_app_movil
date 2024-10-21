import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { Evento } from 'src/app/models/evento';

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
    id_creador: 0
  };

  eventoEdicion: Evento = { ...this.evento }; // Copia para edición
  isEditing: boolean = true;

  constructor(
    private router: Router,
    private _eventoService: ServiceEventoService
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.evento.id_evento = navigation.extras.state['idEvento'];
      console.log("Id evento en editar-evento: "+this.evento.id_evento)
      this.obtenerEvento();
    }
  }

  obtenerEvento() {
    if (this.evento.id_evento) {
      this._eventoService.getEventoById(this.evento.id_evento).subscribe({
        next: (response) => {
          if (response.body) {
            this.evento = response.body[0];
            this.eventoEdicion = { ...this.evento }; // Inicializa la copia para editar
          }
        }
      });
    }
  }

  actualizarEvento() {
    console.log('Evento con datos nuevos: ', JSON.stringify(this.eventoEdicion));

    if (this.evento.id_evento) {
      const id = this.evento.id_evento.toString();

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
    } else {
      console.log('El ID de evento no está definido');
    }
  }

  revertirCambios() {
    this.eventoEdicion = { ...this.evento }; // Restablece la copia a los datos originales
    this.isEditing = false; // Termina la edición
  }

  irHome() {
    this.router.navigate(['home']);
  }

  irMisEventos() {
    this.router.navigate(['mis-eventos']);
  }
}
