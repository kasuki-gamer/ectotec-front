import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactoComponent } from './components/contacto/contacto.component';

const routes: Routes = [
  {path:'contacto',component:ContactoComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'contacto' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
