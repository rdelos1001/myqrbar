import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { EditorComponent } from 'src/app/componentes/editor/editor.component';
import { Bar } from 'src/app/interfaces/bar';
import { ObtenerDatosService } from 'src/app/services/obtener-datos.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToolsService } from 'src/app/services/tools.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-bares',
  templateUrl: './bares.page.html',
  styleUrls: ['./bares.page.scss'],
})
export class BaresPage implements OnInit {

  constructor(private _getData: ObtenerDatosService,
    private callNumber: CallNumber,
    private statusBar:StatusBar,
    private _tools: ToolsService,
    private modalController: ModalController,
    private socialSharing: SocialSharing,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private loading: LoadingController) { }

  nombreBuscar:string;
  existenBares:boolean=false
  baresCargados: Bar[] = [];
  mostrarBotones: boolean = false;
  filtros: any = {
    nombre: false
  }
  mostrarCargando: boolean = true;

  public ngOnInit() {
    this.cargarBares();
    this.statusBar.styleDefault()
    this.statusBar.backgroundColorByHexString("ffc409");

  }

  invertir(bares?: Bar[]) {
    if (bares) {
      return bares.reverse();
    }
    this.baresCargados = this.baresCargados.reverse();
  }

  async cargarBares() {
    await this.cargando();
    var aux: Bar[] = await this._getData.recuperarTodosBares();
    if (aux.length>0){
      //Esto ordena de la más antigua a la más nueva
      aux = this.ordenarBaresPorFecha(aux);

      //Esto lo ordena de la más nueva a la más antigua
      this.baresCargados = this.invertir(aux);

      this.existenBares=true
    }else{
      this.existenBares=false
    }
    //Quita la ventana de cargando
    this.mostrarCargando = false
    this.loading.dismiss()
  }

  public llamarTelefono(bar:Bar){
    var numero=bar.telefono+""
    if(numero.length==9){
      this.alertLlamar(bar)
    }else{
      this._tools.presentToast("El número no es válido")
    }
  }

  async alertLlamar(bar:Bar) {
    const alert = await this.alertController.create({
      header: '¿Estas seguro?',
      message: 'Estas seguro de llamar a <strong>'+bar.Nombre+'</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'danger',
        }, {
          text: 'Okay',
          handler: () => {
            this.callNumber.callNumber(bar.telefono+'',true)
          }
        }
      ]
    });

    await alert.present();
  }

  public compartirWhatsApp(bar: Bar) {
    this.socialSharing.shareViaWhatsApp(
      'MYQRBAR'+
      '\nNombre:' + bar.Nombre+
      '\nURL: '+ bar.url+
      '\nTeléfono: '+bar.telefono+
      '\nValoración: '+bar.valoracion+
      '\nComentarios: '+bar.comentarios)
      .catch(() => {
        this._tools.presentToast('Error al compartir por WhatsApp')
      });
  }
 
  public compartirFacebook(bar: Bar) {
    this.socialSharing.shareViaFacebook(
    'MYQRBAR'+
    '\nNombre:' + bar.Nombre+
    '\nURL: '+ bar.url+
    '\nTeléfono: '+bar.telefono+
    '\nValoración: '+bar.valoracion+
    '\nComentarios: '+bar.comentarios)
      .catch(() => {
        this._tools.presentToast('Error al compartir por Facebook')
      });
  }

  async mostrarModal(bar: Bar, i: number) {

    const modal = await this.modalController.create({
      component: EditorComponent,
      componentProps: {
        dato: {
          Nombre: bar.Nombre,
          Fecha: bar.Fecha,
          telefono: bar.telefono,
          url: bar.url,
          valoracion: bar.valoracion,
          comentarios: bar.comentarios
        }
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.baresCargados[i] = data
      this._getData.actualizarBar(data);
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ordenar por',
      buttons: [
        {
          text: 'Nombre',
          icon: 'text-outline',
          handler: () => {
            this.baresCargados = this.ordenarBaresPorNombre(this.baresCargados)
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => { }
        }]
    });

    await actionSheet.present();
  }

  async borrar(bar: Bar, i: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estas seguro de eliminar el bar <strong>' + bar.Nombre + '</strong>?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'danger',
        }, {
          text: 'Aceptar',
          cssClass: 'success',
          handler: () => {
            this._getData.borrarBar(bar)
            this._tools.presentToast('Borrado el bar ' + bar.Nombre)
            this.cargarBares()
          }
        }
      ]
    });
    await alert.present();
  }


  public ordenarBaresPorFecha(bares: Bar[]) {
    const ordenado = bares.sort((a, b) => {
      if (a.Fecha > b.Fecha) {
        return 1
      }
      if (a.Fecha < b.Fecha) {
        return -1
      }
      return 0

    })
    return ordenado;
  }

  public ordenarBaresPorNombre(bares: Bar[]) {
    this.filtros.nombre = true;
    const ordenado = bares.sort((a, b) => {
      if (a.Nombre > b.Nombre) {
        return 1
      }
      if (a.Nombre < b.Nombre) {
        return -1
      }
      return 0
    })
    return ordenado;
  }
  public eliminarFiltroNombre() {
    this.filtros.nombre = false;
    //Esto ordena de la más antigua a la más nueva
    this.baresCargados = this.ordenarBaresPorFecha(this.baresCargados);

    //Esto lo ordena de la más nueva a la más antigua
    this.baresCargados = this.invertir(this.baresCargados); 
  }

  public abrirPagina(url: string) {
    this._tools.abrirPagina(url);
  }

  async cargando() {
    const loading = await this.loading.create({
      message: 'Por favor espera...',
      spinner: 'bubbles'
    });

    await loading.present();
  }

  public changeBuscar(){
    var input =document.getElementById('buscarInput')
    if(input.style.visibility!="hidden"){
      input.style.visibility="hidden"
    }else{
      input.style.visibility=""
    }
  }
  async buscar(){
    var bares:Bar[]= await this._getData.recuperarTodosBares();
    this.nombreBuscar=this.nombreBuscar.toUpperCase();
    this.baresCargados=this._tools.buscarNombre( bares,this.nombreBuscar)
  }
}