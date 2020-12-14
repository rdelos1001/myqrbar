import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {

  tamanyoLetra: string;
  constructor(private alertController:AlertController) { }

  ngOnInit() {
  }

  async acercaDe() {

    const alert = await this.alertController.create({
      header: 'Acerca de ',
      message: '<strong>Autor: </strong>Raúl de los Santos Cabrera'
                +'<strong>Versión: </strong>'+environment.VERSION,
      buttons: ['OK']
    });

    await alert.present();
  }
}
