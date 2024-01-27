import { Injectable } from '@angular/core';
import { Bar } from 'src/app/interfaces/bar'
import { ToolsService } from './tools.service';

@Injectable({
  providedIn: 'root'
})
export class ObtenerDatosService {

  constructor(private _tools:ToolsService) { }
  
  async guardarBar(newBar:Bar, forceSave:boolean =false){
    if(forceSave || !await this.existeBar(newBar.url)){
      newBar.Nombre=newBar.Nombre.toUpperCase();
      localStorage.setItem(newBar.Fecha,JSON.stringify(newBar))
      this._tools.presentToast('Guardando bar como \''+newBar.Nombre+'\'' )
    }else{
      this._tools.presentToast('El bar ya está guardado' )
    }
  } 

  recuperarBar(key:string):Bar{
    console.log(key);
    
    console.log(localStorage.getItem(key));
    
    let bar:Bar=JSON.parse( localStorage.getItem(key))
    return bar;
  }
  async recuperarTodosBares(){
    var list= await localStorage.length;
    var bares:Bar[]=[];

    for (let i = 0; i < localStorage.length; i++) {

      bares.push( this.recuperarBar(localStorage.key(i)) )      
    }

    return bares
  }
  async actualizarBar(bar:Bar){
    localStorage.setItem(bar.Fecha,JSON.stringify(bar));
  }
  async borrarBar(bar:Bar){
    localStorage.removeItem(bar.Fecha)
  }
  async existeBar(codeData:string){
    var check=false;
    const baresExistentes= await this.recuperarTodosBares();
    let i=0;
    while(baresExistentes.length>0 && !check||baresExistentes.length>i){
      if(baresExistentes[i].url==codeData)check=true;
      i++;
    }
    return check
  }

}