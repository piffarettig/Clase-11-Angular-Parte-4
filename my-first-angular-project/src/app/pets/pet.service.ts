import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';

import { Pet } from './pet';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()
export class PetService {
    
    private WEB_API_URL : string = 'api/pets/test-api.json';

    constructor(private _httpService: Http) {  }

    getPets(): Observable<Array<Pet>> {
        return this._httpService.get(this.WEB_API_URL)
        .map((response : Response) => <Array<Pet>> response.json())
        .do(data => console.log('Los datos que obtuvimos fueron: ' + JSON.stringify(data)))
        .catch(this.handleError);
    }

    // getPetById(id : string): Observable<Pet> {
    //     return this._httpService.get(this.WEB_API_URL)
    //     .map((response : Response) => <Pet> response.json().find((pet : Pet) => pet.id == id))
    //     .do(data => console.log('Los datos que obtuvimos fueron: ' + JSON.stringify(data)))
    //     .catch(this.handleError);
    // }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error|| 'Server error');
    }

}