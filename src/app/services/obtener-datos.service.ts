import { Injectable } from '@angular/core';
import { Bar } from 'src/app/interfaces/bar'
import { Storage } from '@ionic/storage';
import { ToolsService } from './tools.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class ObtenerDatosService {

  constructor(private storage:Storage,
              private _tools:ToolsService,
              private geo:Geolocation) { }
  
  async guardarBar(newBar:Bar){
    if(!await this.existeBar(newBar.url)){
      newBar.Nombre=newBar.Nombre.toUpperCase();
      this.storage.set(newBar.Fecha,newBar)
      this._tools.presentToast('Guardando bar como \''+newBar.Nombre+'\'' )
    }else{
      this._tools.presentToast('El bar ya está guardado' )
    }
  } 

  async recuperarBar(key:string){
    let bar:Bar={
      Nombre:'',
      Fecha:'',
      telefono:NaN,
      geolocalizacion:null,
      url:'',
      comentarios:''
    };
    await this.storage.get(key).then((val)=>{
      bar.Nombre=val.Nombre;
      bar.Fecha=val.Fecha;
      bar.telefono=val.telefono;
      bar.geolocalizacion=val.geolocalizacion;
      bar.url=val.url;
      bar.comentarios=val.comentarios;
    })
    return bar;
  }
  async recuperarTodosBares(){
    var list= await this.storage.keys();
    var bares:Bar[]=[];

    for(var key of list) {
      bares.push(await this.recuperarBar(key));
    }

    return bares
  }
  async actualizarBar(bar:Bar){
    this.storage.set(bar.Fecha,bar);
  } 
  async borrarBar(bar:Bar){
    this.storage.remove(bar.Fecha)
  }
  async existeBar(codeData:string){
    var check=false;
    const baresExistentes= await this.recuperarTodosBares();
    for (var bar of baresExistentes) {
      if(codeData==bar.url){
        check=true;
      }
    }
    return check
  }

  async obtenerUbicacionActual(){
    var geoActual:Geoposition;
    await this.geo.getCurrentPosition().then((resp)=>{
      const presicion=resp.coords.accuracy
      geoActual=resp

      // if(presicion>30){
      //   throw Error
      // }else{
      //   geoActual=resp
      // }
    }).catch(()=>{
      this._tools.presentToast('Ha habido un error con la geolocalización o esta no es precisa')
    })
    return geoActual
  }

  /**Devuelve los metros que hay de distancia entre el origen y el destino */
  public calcularDistancia(origen:Geoposition,destino:Geoposition){
  
    let lat1=origen.coords.latitude
    let lon1=origen.coords.longitude
    let lat2=destino.coords.latitude
    let lon2=destino.coords.longitude

    //Calcula la distancia en kilometros
    let p = 0.017453292519943295;
    let c = Math.cos;
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((lon1- lon2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a)));

    //Convierte la distancia en metros
    dis=dis*1000
    return Math.trunc(dis);
  }
}