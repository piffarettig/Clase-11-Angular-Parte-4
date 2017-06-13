"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var pet_filter_pipe_1 = require("./pets/pet-filter.pipe");
var app_component_1 = require("./app.component");
var pet_list_component_1 = require("./pets/pet-list.component");
var star_component_1 = require("./shared/star.component");
var welcome_component_1 = require("./home/welcome.component");
var pet_detail_component_1 = require("./pets/pet-detail.component");
var pet_detail_service_guard_1 = require("./pets/pet-detail-service.guard");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            router_1.RouterModule.forRoot([
                { path: 'pets', component: pet_list_component_1.PetListComponent },
                { path: 'pets/:id',
                    component: pet_detail_component_1.PetDetailComponent,
                    canActivate: [pet_detail_service_guard_1.PetDetailGuard]
                },
                { path: 'welcome', component: welcome_component_1.WelcomeComponent },
                { path: '', redirectTo: 'welcome', pathMatch: 'full' },
                { path: '**', redirectTo: 'welcome', pathMatch: 'full' } //cualquier otra ruta que no matchee, va a ir al WelcomeComponent, aca podría ir una pagina de error tipo 404 Not Found
            ])
        ],
        declarations: [app_component_1.AppComponent, welcome_component_1.WelcomeComponent, pet_list_component_1.PetListComponent, star_component_1.StarComponent, pet_filter_pipe_1.PetFilterPipe, pet_detail_component_1.PetDetailComponent],
        bootstrap: [app_component_1.AppComponent],
        providers: [pet_detail_service_guard_1.PetDetailGuard]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map