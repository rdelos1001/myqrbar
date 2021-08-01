import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Bar } from 'src/app/interfaces/bar';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {

  @Input()dato:Bar;
  formHabilitado:boolean=true;
  constructor(private modalController:ModalController,
              private _tools:ToolsService) { }

  ngOnInit() {
  }

  cancelar(){
    this.modalController.dismiss();
  } 
  modificarDatos(){
    this.dato.Nombre=this.dato.Nombre.toUpperCase()
    this.modalController.dismiss(this.dato);
  }
  validarNombre(){
    if(this.dato.Nombre.length==0){
      this._tools.presentToast('El nombre no puede estar vacío')
      this.formHabilitado=false;
    }else{
      this.formHabilitado=true
    }
  }
}
