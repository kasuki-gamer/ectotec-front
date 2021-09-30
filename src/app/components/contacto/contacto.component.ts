import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CaptchaService } from 'src/app/services/captcha.service';
import { map } from 'rxjs/operators';
import { ContactoRequest } from 'src/app/models/contacto-request.model';
import { ContactoService } from 'src/app/services/contacto.service';
import { ModalerrorComponent } from '../modalerror/modalerror.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import {startWith} from 'rxjs/operators';
@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  errores: string[] = [];
  forma: FormGroup;

  urlApi = environment.urlApi + 'captcha';
  @ViewChild('image', {static: true}) image!: ElementRef;


  filteredDescCatalogo: Observable<string[]> | undefined;
  descCatalogo: string[] = []; 
  constructor(private fb: FormBuilder, private captchaService: CaptchaService, private contactoService: ContactoService
    ,         private modalService: NgbModal, private datepipe: DatePipe) {
    this.forma = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(200), Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      fecha: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      ciudadEdo: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      // captcha: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)], [this.captchaAsyncValidator()]]
      captcha: ['', [Validators.required,Validators.minLength(4), Validators.maxLength(4)]]
    });

    

     this.forma.get('ciudadEdo')?.valueChanges
     .subscribe(value => {
      if(value.length > 3){
        this.filteredDescCatalogo = this.contactoService.getGeo({text:value})
      }

     })
     
    
   }

  ngOnInit(): void {
  }

  calculateDiff(date: string) {
    let currentDate = new Date();
    const dateSent = new Date(date);
 
    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
 }

  guardar(): void {

    console.log( this.forma );
    if ( this.forma.invalid ) {
      return Object.values( this.forma.controls ).forEach( control => {
        if ( control instanceof FormGroup ) {

          Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else {
          control.markAsTouched();
        }
      });

    }else{
      //this.buttondisabled = true;

      

      const contactoRequest = this.forma.value as ContactoRequest;
      const fecha = this.forma.get('fecha')?.value;
      contactoRequest.fecha = String(this.datepipe.transform(fecha.year + '-' + fecha.month + '-' + fecha.day, 'yyyy-MM-dd'));

      if(this.calculateDiff(contactoRequest.fecha) >= 36500)
      {
        this.errores = [];
        this.errores.push('La fecha no es válida');
        const modalRef = this.modalService.open(ModalerrorComponent,{centered:true});
        modalRef.componentInstance.errores = this.errores;
      }



      this.contactoService.addContacto(contactoRequest)
        .subscribe(() => {
          // this.modalService.open(ModalregistroComponent,{centered:true});
        }, errores => {
          this.errores = this.parsearErroresAPI(errores);
          //console.log(this.errores);
          const modalRef = this.modalService.open(ModalerrorComponent,{centered:true});
          modalRef.componentInstance.errores = this.errores;
          
        } );



    }
  }

  getLinkPicture(): void {

    this.image.nativeElement.setAttribute('src', this.urlApi + '?' + (new Date()).getTime());
  }

  campoEsValido( campo: string ) {
    return this.forma.controls[campo].errors 
            && this.forma.controls[campo].touched;
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  captchaAsyncValidator(): AsyncValidatorFn{
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.captchaService.getCatpcha(control.value).pipe(
        map( resp => {

          return (resp.captchaCode.length > 0) ? null : { asyncValidation : 'failed'}  ;

        })
      );
    };
  }

  parsearErroresAPI(response: any): string[] {

    const resultado: string[] = [];
    console.log(typeof response.error);

    if (typeof response === 'string') {
      resultado.push(response);
    }

    if (response.error) {
      if (typeof response.error === 'string') {
        resultado.push(response.error);
      } else if (Array.isArray(response.error)){
        response.error.forEach((valor: any) => resultado.push(valor.description));
      } else {
        const mapaErrores = response.error.errors;
        const entradas = Object.entries(mapaErrores);
        entradas.forEach((arreglo: any[]) => {
          const campo = arreglo[0];
          arreglo[1].forEach((mensajeError: any) => {
            resultado.push(`${campo}: ${mensajeError}`);
          });
        });
      }
    }

    return resultado;
  }

}
