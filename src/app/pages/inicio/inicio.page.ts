import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core'
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ObtenerDatosService } from 'src/app/services/obtener-datos.service';
import { ToolsService } from 'src/app/services/tools.service';



@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  constructor(private barcodeScanner: BarcodeScanner,
              private _getData:ObtenerDatosService,
              private _tools:ToolsService) { }
  ngOnInit() {
  }
  
  private codeData:string;
  async escanear(){
    const posicionActual= await this._getData.obtenerUbicacionActual()
    await this.barcodeScanner.scan().then(barcodeData => {
      console.log(posicionActual)
      this.codeData=barcodeData.text;
      this._tools.abrirPagina(this.codeData);
      const fecha=this.obtenerFechaActual();
      const nombre='Bar '+fecha;
      this._getData.guardarBar({
        Nombre:nombre,
        Fecha:fecha,
        telefono:null,
        geolocalizacion: posicionActual,
        url:this.codeData,
        comentarios:''
      })
    }).catch(err => {
      console.log('Error', err);
      this._tools.presentToast('No se ha podido escanear');
      //Esto es hacer pruebas creando datos sin necesidad de escanear codigos qr 
      //DEBERIA BORRARSE EN LA VERSIÓN FINAL
      const fecha=this.obtenerFechaActual();

      this._getData.guardarBar({
        Nombre:'Bar '+fecha,
        Fecha:fecha,
        telefono:null,
        geolocalizacion:posicionActual,
        url:'htt',
        comentarios:''
      })
      //-------------------------------
    });
  }

  public obtenerFechaActual(){
    const fecha= new Date();
    var dia:string;
    if(fecha.getDate()<10 && fecha.getDate()>=0){
      dia = '0'+fecha.getDate();
    }else{
      dia = fecha.getDate()+"";
    }
    
    var mes:string;
    if(fecha.getMonth()<10 && fecha.getMonth()>=0){
      mes = '0'+fecha.getMonth();
    }else{
      mes = fecha.getMonth()+"";
    }

    var hora:string;
    if(fecha.getHours()<10 && fecha.getHours()>=0){
      hora = '0'+fecha.getHours();
    }else{
      hora = fecha.getHours()+"";
    }

    var minutos:string;
    if(fecha.getMinutes()<10 && fecha.getMinutes()>=0){
      minutos = '0'+fecha.getMinutes();
    }else{
      minutos = fecha.getMinutes()+"";
    }

    var segundos:string;
    if(fecha.getSeconds()<10 && fecha.getSeconds()>=0){
      segundos = '0'+fecha.getSeconds();
    }else{
      segundos = fecha.getSeconds()+"";
    }

    const fechastr= `${dia}-${mes}-${fecha.getFullYear()} ${hora}:${minutos}:${segundos}`
    return fechastr
  }
  async onClick(){
    console.log(await this._getData.obtenerUbicacionActual())
  }
}
