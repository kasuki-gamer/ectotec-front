import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modalerror',
  templateUrl: './modalerror.component.html',
  styleUrls: ['./modalerror.component.css']
})
export class ModalerrorComponent implements OnInit {

  @Input() errores: string[] = [];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
