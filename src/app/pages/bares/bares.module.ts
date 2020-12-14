import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BaresPageRoutingModule } from './bares-routing.module';

import { BaresPage } from './bares.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BaresPageRoutingModule,
    ComponentesModule
  ],
  declarations: [BaresPage]
})
export class BaresPageModule {}
