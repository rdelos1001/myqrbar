import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Bar } from 'src/app/interfaces/bar';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {

  @Input()dato:Bar;
  constructor(private modalController:ModalController) { }

  ngOnInit() {
  }

  cancelar(){
    this.modalController.dismiss();
  } 
  modificarDatos(){
    this.modalController.dismiss(this.dato);
  }
}
