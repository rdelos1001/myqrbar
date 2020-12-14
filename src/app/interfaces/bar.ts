import { Geoposition } from "@ionic-native/geolocation/ngx";

export interface Bar {
    Nombre:string
    Fecha:string
    url:string
    telefono:number
    geolocalizacion:Geoposition
    comentarios:string
}