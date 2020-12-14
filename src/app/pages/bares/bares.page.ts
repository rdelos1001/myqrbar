import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { EditorComponent } from 'src/app/componentes/editor/editor.component';
import { Bar } from 'src/app/interfaces/bar';
import { ObtenerDatosService } from 'src/app/services/obtener-datos.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-bares',
  templateUrl: './bares.page.html',
  styleUrls: ['./bares.page.scss'],
})
export class BaresPage implements OnInit {

  constructor(private _getData: ObtenerDatosService,
    private _tools: ToolsService,
    private modalController: ModalController,
    private socialSharing: SocialSharing,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private loading: LoadingController) { }

  baresCargados: Bar[] = [];
  mostrarBotones: boolean = false;
  filtros: any = {
    nombre: false
  }
  mostrarCargando: boolean = true;

  async ngOnInit() {
    await this.cargando()
    this.cargarBares().then(() => {
      this.loading.dismiss()
      this.mostrarCargando = false
    });
  }

  invertir(bares?: Bar[]) {
    if (bares) {
      return bares.reverse();
    }
    this.baresCargados = this.baresCargados.reverse();
  }

  async cargarBares() {

    var aux: Bar[] = await this._getData.recuperarTodosBares();

    //Esto ordena de la más antigua a la más nueva
    aux = this.ordenarBaresPorFecha(aux);

    //Esto lo ordena de la más nueva a la más antigua
    this.baresCargados = this.invertir(aux);
  }

  public compartirWhatsApp(bar: Bar) {
    this.socialSharing.shareViaWhatsApp('MYQRBAR\nNombre:' + bar.Nombre + ', \nurl: ', '', bar.url)
      .catch(() => {
        this._tools.presentToast('Error al compartir por WhatsApp')
      });
  }
  public compartirFacebook(bar: Bar) {
    this.socialSharing.shareViaFacebook('MYQRBAR\nNombre:' + bar.Nombre + ', \nurl: ', '', bar.url)
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
          text: 'Distancia',
          icon: 'earth',
          handler: () => {
            this.ordenarBaresPorDistancia(this.baresCargados)
          }
        },
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
          text: 'Okay',
          cssClass: 'success',
          handler: () => {
            this._getData.borrarBar(bar)
            this.baresCargados.splice(i, 1);
            this._tools.presentToast('Borrado el bar ' + bar.Nombre)

          }
        }
      ]
    });
    await alert.present();
  }

  async ordenarBaresPorDistancia(bares: Bar[]){
    await this._getData.obtenerUbicacionActual().then((resp)=>{
      const posicionActual= resp
      var distancias = new Array()

      bares.forEach(bar => {
        distancias.push({
          bar,
          distancia:this._getData.calcularDistancia(posicionActual,bar.geolocalizacion) })
      });
  
      distancias.sort((a,b)=>{
        if (a.distancia > b.distancia) {
          return 1
        }
        if (a.distancia < b.distancia) {
          return -1
        }
        return 0
      })
      console.log(distancias)
  
      this.baresCargados=bares;
    })
    
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
    this.cargarBares();
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
}