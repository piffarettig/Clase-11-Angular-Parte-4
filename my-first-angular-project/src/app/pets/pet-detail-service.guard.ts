import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable()
export class PetDetailGuard implements CanActivate {

    constructor(private _router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let id = +route.url[1].path;
        if (isNaN(id) || id < 1) {
            alert('La id de la mascota no es valida');
            // redirigimos (a traves de una navegacion), a /pets
            this._router.navigate(['/pets']);
            // abortamos la navegacion actual
            return false;
        };
        return true;
    }
}