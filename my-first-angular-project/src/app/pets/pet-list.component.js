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
var PetListComponent = (function () {
    function PetListComponent(_petsService) {
        this._petsService = _petsService;
        this.pageTitle = "Pet List";
        this.listFilter = "";
        this.imageWidth = 100;
        this.imageMargin = 1;
        this.showImage = false;
        // esta forma de escribir el parametro en el constructor lo que hace es:
        // 1) declara un parametro de tipo PetService en el constructor
        // 2) declara un atributo de clase privado llamado _petService
        // 3) asigna el valor del parámetro al atributo de la clase
    }
    PetListComponent.prototype.toggleImage = function () {
        this.showImage = !this.showImage;
    };
    PetListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._petsService.getPets()
            .subscribe(function (petsObtained) { return _this.pets = petsObtained; }, function (error) { return _this.errorMessage = error; });
    };
    PetListComponent.prototype.onRatingClicked = function (message) {
        this.pageTitle = 'Pet List: ' + message;
    };
    return PetListComponent;
}());
PetListComponent = __decorate([
    core_1.Component({
        selector: 'pm-pets',
        templateUrl: './pet-list.component.html',
        styleUrls: ['./pet-list.component.css']
    }),
    __metadata("design:paramtypes", [pet_service_1.PetService])
], PetListComponent);
exports.PetListComponent = PetListComponent;
//# sourceMappingURL=pet-list.component.js.map