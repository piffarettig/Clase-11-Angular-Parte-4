# Clase-11-Angular-Parte-4

## Hoja de Ruta

- Hoja de ruta - 

## Interactuando con una API REST a través de HTTP: Observables 

Los datos a usar en nuestra aplicación van a estar almacenados en algún lado; en la nube, en un servidor en nuestra misma red, en nuestra pc de escritorio, etc. ¿Cómo hacemos para lograr traer esos datos y meterlos dentro de nuestras Views?

En este módulo aprenderemos a enviar HTTP requests con Observables para obtener datos.

La mayoría de las aplicaciones hechas en Angular obtienen datos usando HTTP.

1. La aplicación envía una request a un servidor/web service (HTTP GET http://lupi.com/api/pets/2)
2. Ese Web Service obtiene los datos, seguramente accediendo a una base de datos.
3. El Web Service le contesta a la aplicación, con los datos obtenidos, en forma de una HTTP Response.
4. La aplicación procesa entonces los datos (por ej: los muestra en una View).

Observables y las ‘Reactive Extensions’

Los Observables nos permiten manejar datos asincrónicos, como los datos que vendrán de nuestro backend o web service.

Los Observables tratan a los eventos como una colección; podemos pensar a un Observable como un array de elementos que van llegando asincrónicamente a medida que pasa el tiempo. Hoy en día no tenemos Observables, estos son una feature propuesta para ES2016 (versión superior de JavaScript), por lo que para poder usarlos debemos utilizar una librería de terceros: RxJS o Reactive Extensions. No confundir esto con ReactJS.

Los observables se usan incluso dentro de Angular, en su sistema de eventos o en su servicio HTTP (que es por eso que lo estamos viendo).

Los Observables tienen métodos. La gracia de estos métodos es que, una vez se aplican sobre un observable, estos realizan alguna transformación sobre el  Observable original, y lo retornan. Estos métodos siempre devuelven un Observable, permitiendo concatenar llamadas sobre un Observable de forma simple. Ejemplo: map, filter, take, merge, etc.

Una vez tengamos nuestros Observables, un método en nuestro código puede suscribirse a un Observable, para recibir notificaciones asincrónicas a medida que nuevos datos vayan llegando. Dicho método puede entonces “reaccionar” (react), sobre esos datos. Dicho método a su vez es notificado cuando no hay más datos, o cuando un error ocurre.

Hacer comparación promises vs observables.



—

There is a huge advantage of observables that is quite relevant here.	Observable supports cancellation while Promise doesn't.
Using subscribe() and map(), instead of then() doesn't seem to add much complication to me. You can also use toPromise() to get a Promise if that is what you need.
See also Angular - Promise vs Observable for more details.
Also if FRP style of programming is used it's handy to get an observable everywhere. If that is not desired just using toPromise() gives a Promise and the slightly simpler API.

	Promise
A Promise handles a single event when an async operation completes or fails.
Note: There are Promise libraries out there that support cancellation, but ES6 Promise doesn't so far.
Observable
An Observable is like a Stream (in many languages) and allows to pass zero or more events where the callback is called for each event.
Often Observable is preferred over Promise because it provides the features of Promise and more. With Observable it doesn't matter if you want to handle 0, 1, or multiple events. You can utilize the same API in each case.	Observable also has the advantage over Promise to be cancelable. If the result of an HTTP request to a server or some other expensive async operation isn't needed anymore, the Subscription of an Observable allows to cancel the subscription, while a Promise will eventually call the success or failed callback even when you don't need the notification or the result it provides anymore.
Observable provides operators like map, forEach, reduce, ... similar to an array
There are also powerful operators like retry(), or replay(), ... that are often quite handy.

— 

Notar que podremos usar Promises en lugar de Observables en caso de que lo queramos para hacer requests HTTP.

Tutorial:

Como ya hemos vistos, los servicios de Angular son una excelente forma de encapsular lógica como la obtención de datos de un web service / backend, para que cualquier otro componente o service que lo precise lo use, a través de inyección de dependencias. En la clase anterior hicimos eso, pero manteniendo una lista hardcodeada de mascotas. En su lugar, queremos enviar una solicitud HTTP para obtener las mascotas. 

Angular provee un Servicio HTTP que nos permite llevar a cabo esto; donde luego de comunicarnos con el backend, cada vez que este nos responda, la respuesta llegará a nuestro servicio (PetService), en forma de Observable.

1. 

A su vez necesitamos registrar el provider de ese service, en el Angular Injector. Como en muchos casos, esto ya viene hecho. Particularmente, el módulo HttpModule lleva eso a cabo. Por ende, debemos agregarlo al array de imports de nuestro AppModule.

import { HttpModule } from '@angular/http';

Y más abajo

@NgModule({
  imports:      
  [ 
    BrowserModule, 
    FormsModule, 
    HttpModule, …


Recordemos que el array declarations es para declarar componentes, directivas y pipes que pertenecen a nuestro módulo. Mientras que el array imports es para obtener módulos de afuera.

2. Vamos al PetService:

Hagamos getProducts devuelve una respuesta de tipo Observable<Response>

Importamos también: import { Observable } from ‘rxjs/Observable’;

Es importante notar que las llamadas HTTP son operaciones asincrónicas únicas, por lo que la secuencia Observable contiene sólo un elemento  del tipo Response. 

Es importante notar que también precisamos hacer:

import { Http, Response } from ‘@angular/http’;

Y ahora veamos esto, realmente queremos un Observable que contenga Response?


Para cargar el operador map, tenemos que cargarlo usando import:

import ‘rxjs/add/operator/map’;

Esta es una forma bastante inusual de cargar cosas: le dice al Module Loader que cargue una librería, sin particularmente importar nada. Cuando la librería se carga, su código JS se carga, cargándose para esta librería en particular, la función map para que quede disponible.

No olvidamos darle:

npm install rxjs --save 
npm start

Para mantener las cosas simples, hagamos que mismo nuestro Web Server retorne un JSON de las mascotas:


CODIGO DE API TRUCHA

La clase queda algo así:

 import { Observable } from 'rxjs/Observable';
 import { Http, Response } from '@angular/http';
 import 'rxjs/add/operator/map';

@Injectable()
export class PetService {
    
    private WEB_API_URL : string = 'api/pets/test-api.json';

    constructor(private _httpService: Http) {  }

    // esto luego va a ser una llamada a nuestra api REST
    getPets(): Observable<Response> {
        return this._httpService.get(this.WEB_API_URL);
    }
    
}


Nuestros componentes, como el PetListComponent, esperan recibir una lista de Mascotas (Pets), no de respuestas Http. En consecuencia precisamos “traducir” cada response en un array de mascotas. Eso lo hacemos con el operador map. Dicho operador lo que nos va a permitir es tomar la Response Http y convertirla en un array de Mascotas. El argumento que recibe dicha función es una array function, como ya hemos visto, que son simplemente lambda expressions, que transforma la respuesta en un JSON. Quedando algo así:

  getPets(): Observable<Array<Pet>> {
        return this._httpService.get(this.WEB_API_URL)
        .map((response : Response) => <Array<Pet>> response.json());
    }


Ahora simplemente agregamos otro operador, para manejar errores. Esto es importante ya que muchísimas cosas pueden darse al querer comunicarse con un servicio de backend, desde una conexión perdida, una request inválida, etc. En consecuencia, agreguemos manejo de excepciones. 

Importamos los siguientes dos operadores:

 import 'rxjs/add/operator/catch'; //para manejar excepciones
 import 'rxjs/add/operator/do'; //para hacer algo cada vez que llega una request (ej: loggear y ver que llegó.

Nos queda algo así:

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

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error|| 'Server error');
    }

}

Finalmente, lo que hacemos es que nuestro componente se suscriba al resultado de la llamada (a los observables). Esto lo hacemos a través del método suscribe. Y cómo los Observables manejan múltiples valores a lo largo del tiempo, la función es llamada para cada valor que el Observable emite. En algunos casos queremos saber cuando el observable se completa, por lo que también podemos tener una función de completado (tercer argumento que es opcional, se ejecuta cuando se completa).

A su vez cuando queramos podemos cancelar la suscripción cuando queramos, con el objeto que nos devolvió al suscribirnos.

La idea es que nuestro componente sea notificado cada vez que un Observable emite un elemento, haciendo alguna acción particular para cada caso (OK, y Error). 

Vayamos al PetListComponent:

## Conceptos avanzados de Routing

La otra clase habíamos visto los aspectos básicos de Routing. Ahora veremos algunas técnicas adicionales para manipular las rutas.

Por ahora solo podemos navegar a ciertas rutas y mostrar vistas, pero ese es un escenario muy básico. Por ejemplo cómo hacemos para pasar parámetros a una ruta? O cómo hacemos para activar rutas a través de código? O cómo hacemos para proteger rutas y permitir que solo ciertos usuarios o dadas ciertas condiciones dichas rutas sean visibles?

### Pasando parámetros a nuestras rutas

Pasar parámetros para las rutas. Veamos el ejemplo si quisiéramos ver el detalle de las mascotas:


0. Creamos un PetDetailComponent:

- HTML:

<div class="panel panel-primary">
    <div class="panel-heading">
        {{pageTitle}}
    </div>
</div>


TS:

import { Component } from '@angular/core';

import { Pet } from './pet';

@Component({
    templateUrl: "./pet-detail.component.html"
}) 
export class PetDetailComponent {
    pageTitle : string = 'Pet Detail';
    pet : Pet;
}

CSS

(por ahora vacío)

Y LO AGREGAMOS AL APPmodule


1. Seteamos el path en app.module.ts (AppModule). En este caso el path sería: pets/id, indicando que ruta a un componente PetDetailComponent. A su vez, le pasamos el parámetro id, con un slash y un dos puntos adelante (/:id). Si quisiéramos más parámetros, repetimos esto.
2. En el HTML de nuestro listado de mascotas, ponemos un link (ancla) sobre el nombre, de manera de que cada vez que se haga click sobre el mismo, dicha ruta se resuelva y se le pase el parámetro asociado.

  <td><a [routerLink]="['/pets', aPet.id]"> {{aPet.name | uppercase}} </a></td>


1. En el PetDetailComponent, leemos los parámetros de la ruta, usando el service ActivatedRoute de ‘@angular/router’.

Lo inyectamos en nuestro componente para que use este servicio (el provider ya viene resuelto por el RouterModule que usamos la clase anterior):

constructor(private _currentRoute: ActivatedRoute) {  }

3. Agarramos el parámetro de la ruta y lo ponemos en una variable privada, dicha lógica lo haremos en el OnInit (hay que implementar OnInit).



    ngOnInit() : void {
        // let (es parte de ES2015) y define una variable que vive en este scope
        // usamos el nombre del parámetro que uamos en la configuración de la ruta y lo obtenemos
        let id =+ this._currentRoute.snapshot.params['id'];
        // definimos el string con interpolacion 
        this.pageTitle +=  `: ${id}`;

    }


### Routing a través de código

Hacer Routing a través de código:

Haremos Routing en código en lugar de hacerlo con la directiva RouterLink que hemos venido usando en el template.

Por ejemplo: un botón de Save que tiene que ejecutar cierto código una vez que se llenen campos, y recién ahí rutear (si todo salió satisfactoriamente).

Para routear con código, usaremos el Router service.

Recordemos, cada vez que inyectemos un servicio en una clase, tenemos que preguntarnos “registramos este servicio en el Angular Injector?”. En este caso, Esto ya viene dado por el RouterModule.

Tutorial:

1. Importamos el Router Service (ProductDetailComponent)
import { ActivatedRoute, Router } from '@angular/router';

2. Inyectamos el servicio:\


    constructor(private _currentRoute: ActivatedRoute,
                    private _router : Router) {  
    }


3. Creamos la función:

  onBack(): void {
        this._router.navigate(['/pets']); //En caso de que necesite parametros los paso como otros argumentos
    }


4. En el template de ProductDetail (HTML), creamos un botón para ir para atrás:

## Protegiendo las rutas con guardas

Hay situaciones en las que queremos limitar el acceso a nuestras rutas; hacerlas que sean accesibles solo a ciertos usuarios (un Admin) o bajo ciertas condiciones. Para ello usamos **guardas**, el *Angular Router* provee varias guardas para llevar a cabo estas operaciones. Algunas de estas **route guards** son:

- ```CanActivate```: Guarda para navegar A una ruta
- ```CanDeactivate```: Guarda para navegar DESDE una ruta
- ```Resolve```: Para obtener datos antes de navegar a una cierta ruta (antes de activarla)
- ```CanLoad```: Para validar el routing asíncrono

Lo que haremos es construir una guarda que nos deje entrar el ```PetDetailComponent``` a menos que una cierta condición se cumpla. Las guardas se implementan como servicios, por lo que deben ser ```@Injectable()```. A diferencia de los otros servicios que hemos usados, los servicios de guardas deben ser provistos (puestos en el providers array del AppModule).

Tutorial

1) Haremos algo muy simple, una guarda que prevenga la navegación al componente de detalle si la id que pasamos no es un número o es menor que cero.

Creamos entonces ```pet-detail-guard.service.ts``` dentro de ```app/pets```.

Le ponemos el siguiente cdigo:

```typescript
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
```

2) Vamos al AppModule y registramos el servicio en el providers array (luego de importarlo)

import { PetDetailGuard } from './pets/pet-detail-service.guard'

providers: [PetDetailGuard]

Y el path queda algo como:

  { path: 'pets/:id',
        component: PetDetailComponent,
        canActivate:  [PetDetailGuard]
  }, 

Quedando, todo ```app.module.ts```, así:

```typescript
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { PetFilterPipe } from './pets/pet-filter.pipe'

import { AppComponent }  from './app.component';
import { PetListComponent }  from './pets/pet-list.component';
import { StarComponent }  from './shared/star.component';
import { WelcomeComponent } from './home/welcome.component';
import { PetDetailComponent } from './pets/pet-detail.component';
import { PetDetailGuard } from './pets/pet-detail-service.guard'

import { RouterModule } from '@angular/router';

import { HttpModule } from '@angular/http';

@NgModule({
  imports:      
  [ 
    BrowserModule, 
    FormsModule, 
    HttpModule,
    RouterModule.forRoot([
      { path: 'pets', component: PetListComponent},
      { path: 'pets/:id',
        component: PetDetailComponent,
        canActivate:  [PetDetailGuard]
      }, 
      { path: 'welcome', component:  WelcomeComponent},
      { path: '', redirectTo: 'welcome', pathMatch: 'full' }, // configuramos la URL por defecto
      { path: '**', redirectTo: 'welcome', pathMatch: 'full'} //cualquier otra ruta que no matchee, va a ir al WelcomeComponent, aca podría ir una pagina de error tipo 404 Not Found
      ])
   ],
  declarations: [ AppComponent, WelcomeComponent, PetListComponent,StarComponent, PetFilterPipe,PetDetailComponent],
  bootstrap:    [ AppComponent ],
  providers: [PetDetailGuard]
})
export class AppModule { }
```









