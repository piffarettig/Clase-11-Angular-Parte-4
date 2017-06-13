"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var pet_service_1 = require("./pet.service");
var router_1 = require("@angular/router");
var PetDetailComponent = (function () {
    function PetDetailComponent(_currentRoute, _router, _petsService) {
        this._currentRoute = _currentRoute;
        this._router = _router;
        this._petsService = _petsService;
        this.pageTitle = 'Pet Detail';
    }
    PetDetailComponent.prototype.ngOnInit = function () {
        // let (es parte de ES2015) y define una variable que vive en este scope
        // usamos el nombre del parámetro que uamos en la configuración de la ruta y lo obtenemos
        var id = +"" + this._currentRoute.snapshot.params['id'];
        // this._petsService.getPetById(id)
        //         .subscribe(petObtained => this.pet = petObtained,
        //                 error => console.log(error));
        // definimos el string con interpolacion 
        this.pageTitle += ": " + id;
    };
    PetDetailComponent.prototype.onBack = function () {
        this._router.navigate(['/pets']); //En caso de que necesite parametros los paso como otros argumentos
    };
    return PetDetailComponent;
}());
PetDetailComponent = __decorate([
    core_1.Component({
        templateUrl: "./pet-detail.component.html"
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        pet_service_1.PetService])
], PetDetailComponent);
exports.PetDetailComponent = PetDetailComponent;
//# sourceMappingURL=pet-detail.component.js.map