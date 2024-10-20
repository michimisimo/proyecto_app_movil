import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceEventoService } from 'src/app/api/service_evento/service-evento.service';
import { Evento } from 'src/app/models/evento';

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
    id_creador: 0,
    id_lista_invitados: 0
  };


  constructor(private router : Router, private _eventoService : ServiceEventoService) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      console.log("Id evento por navegacion: "+navigation.extras.state['id'])
      this.evento.id_evento = navigation.extras.state['id'];
      console.log('ID del evento:', this.evento.id_evento);
      this.obtenerEvento();
    }
  }

  obtenerEvento(){
    if(this.evento.id_evento){
      this._eventoService.getEventoById(this.evento.id_evento).subscribe({
        next: (response) => {
          if(response.body){
            this.evento = response.body[0];
            console.log("Evento:"+JSON.stringify(this.evento));
          }          
        }
      })
    }    
  }

  irHome() {
    this.router.navigate(['home']);
  }

}
