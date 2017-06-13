import { Component } from '@angular/core';
import  { PetService } from './pets/pet.service';

@Component({
  selector: 'my-app',
  template: `
     <div>
        <nav class='navbar navbar-default'>
            <div class='container-fluid'>
                <a class='navbar-brand'>{{pageTitle}}</a>
                <ul class='nav navbar-nav'>
                    <li><a [routerLink]="['/welcome']">Home</a></li>
                    <li><a [routerLink]="['/pets']">Pet List</a></li>
                </ul>
            </div>
        </nav>
        <div class='container'>
            <router-outlet></router-outlet>
        </div>
     </div>
  `,
  providers: [PetService]
})
export class AppComponent  {}
