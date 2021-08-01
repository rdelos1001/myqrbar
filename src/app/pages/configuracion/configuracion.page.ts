import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {

  tamanyoLetra: string;
  constructor(private alertController:AlertController,
              private statusBar:StatusBar) { }

  ngOnInit() {
    this.statusBar.styleLightContent();
    this.statusBar.backgroundColorByHexString("3880ff")
  }

  async acercaDe() {

    const alert = await this.alertController.create({
      header: 'Acerca de ',
      message: '<strong>Autor: </strong>Raúl de los Santos Cabrera<br>'
                +'<strong>Versión: </strong>'+environment.VERSION,
      buttons: ['OK']
    });

    await alert.present();
  }
}
