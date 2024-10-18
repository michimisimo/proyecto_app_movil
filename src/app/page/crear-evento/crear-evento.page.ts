import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.page.html',
  styleUrls: ['./crear-evento.page.scss'],
})
export class CrearEventoPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }


  irHome() {
    this.router.navigate(['home']);
  }
}
