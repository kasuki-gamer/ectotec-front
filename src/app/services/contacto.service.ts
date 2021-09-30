import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContactoRequest } from '../models/contacto-request.model';
import { ContactoViewModel } from '../models/contacto-view-model.model';


const URL = environment.urlApi;

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private Contacto = URL + 'Contacto/';


  constructor(private http: HttpClient) { }

  addContacto( contactoRequest: ContactoRequest ): Observable<ContactoViewModel>{
    return this.http.post<ContactoViewModel>(this.Contacto + 'Contacto', contactoRequest);
  }

  getGeo(text: {text:string}): Observable<string[]>{

    return this.http.post<string[]>(this.Contacto + 'GetGeoName', text);

  }

}