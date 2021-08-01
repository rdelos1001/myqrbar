import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Bar } from '../interfaces/bar';
import { Browser } from '@capacitor/browser';

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

  async abrirPagina(url:string){
    await Browser.open({url:this.comprobarURL(url)}).catch(()=>{
      this.presentToast('Error al abrir la página web');
      Browser.close();
      throw Error
    })
  }

  public buscarNombre(Bares:Bar[],nombre:string){
    var regex=new RegExp('\\w*'+nombre+'\\w*')
    var aux:Bar[]=[];

    for (const bar of Bares) {
      if(regex.test(bar.Nombre)){
        aux.push(bar)
      }
    }

    return aux
  }
  public comprobarURL(url:string){
    var regex= new RegExp('^www.')
    if(regex.test(url))
    {
      url='http://'+url
    }
    return url
  }

}
