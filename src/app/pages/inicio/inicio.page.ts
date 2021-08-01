import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ObtenerDatosService } from 'src/app/services/obtener-datos.service';
import { ToolsService } from 'src/app/services/tools.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  constructor(private barcodeScanner: BarcodeScanner,
              private _getData:ObtenerDatosService,
              private _tools:ToolsService,
              private statusBar:StatusBar)
  {}
  ionViewWillEnter(){
    this.statusBar.backgroundColorByHexString("222428");
    this.statusBar.styleLightContent();
  }
  ngOnInit() {  }

  async escanear(){
    await this.barcodeScanner.scan().then(barcodeData => {
      this._tools.abrirPagina(barcodeData.text)
      console.log(barcodeData)
      const url=barcodeData.text;
      const fecha=this.obtenerFechaActual();
      if(url!=''){
        this._getData.guardarBar({
          url:url,
          Fecha:fecha,
          Nombre:'Bar '+fecha,
          telefono:null,
          valoracion:1,
          comentarios:''
        })   
      }
    }).catch(err => {
      console.log('Error', err);
      this._tools.presentToast('No se ha podido escanear');
      this._getData.guardarBar({
        url:'url12',
        Fecha:this.obtenerFechaActual(),
        Nombre:'Bar prueba',
        telefono:null,
        valoracion:1,
        comentarios:''
      })   

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
}
