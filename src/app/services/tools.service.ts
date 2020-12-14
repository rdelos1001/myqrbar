import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
const {Browser}= Plugins;

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor(private toastController:ToastController) { }
  async presentToast(msj:string,tiempo?:number) {
    if(!tiempo){
      tiempo=3000
    }
    const toast = await this.toastController.create({
      message: msj,
      duration: tiempo
    });
    toast.present();
  }

  async abrirPagina(codeData:string){
    await Browser.open({url:codeData}).catch(()=>{
      this.presentToast('Error al abrir la página');
      Browser.close();
    })
  }

}
