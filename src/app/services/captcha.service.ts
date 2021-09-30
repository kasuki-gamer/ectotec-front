import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  private urlApi = environment.urlApi + 'captcha';

  constructor( private http: HttpClient) { }

  getCatpcha(captcha: string): Observable<{captchaCode: string}>{
    return this.http.get<{captchaCode: string}>(this.urlApi + '/valida/' + captcha, {
      withCredentials: true
    });
  }
  
}