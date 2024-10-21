import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GaleriaEventoPageRoutingModule } from './galeria-evento-routing.module';

import { GaleriaEventoPage } from './galeria-evento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GaleriaEventoPageRoutingModule
  ],
  declarations: [GaleriaEventoPage]
})
export class GaleriaEventoPageModule {}
