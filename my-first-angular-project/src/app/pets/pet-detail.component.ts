import { Component, OnInit } from '@angular/core';

import { Pet } from './pet';
import { PetService } from './pet.service';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: "./pet-detail.component.html"
}) 
export class PetDetailComponent implements OnInit {
    pageTitle : string = 'Pet Detail';
    pet : Pet;

    constructor(private _currentRoute: ActivatedRoute,
                    private _router : Router,
                    private _petsService : PetService) {  
    }

    ngOnInit() : void {
        // let (es parte de ES2015) y define una variable que vive en este scope
        // usamos el nombre del parámetro que uamos en la configuración de la ruta y lo obtenemos
        let id =+ "" + this._currentRoute.snapshot.params['id'];

        // this._petsService.getPetById(id)
        //         .subscribe(petObtained => this.pet = petObtained,
        //                 error => console.log(error));

        // definimos el string con interpolacion 
        this.pageTitle +=  `: ${id}`;
    }

    onBack(): void {
        this._router.navigate(['/pets']); //En caso de que necesite parametros los paso como otros argumentos
    }

}