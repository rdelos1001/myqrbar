import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CabeceraComponent } from './cabecera/cabecera.component';
import { EditorComponent } from './editor/editor.component'
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    CabeceraComponent,
    EditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports:[
    CabeceraComponent,
    EditorComponent
  ]
})
export class ComponentesModule { }
