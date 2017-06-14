# Angular: Http y Observables y Más sobre Routing

## Hoja de Ruta

1. Interactuando con una API REST a través de HTTP. Observables

2. Routing Avanzado:

	2.1. Pasando parámetros a nuestras rutas

	2.2. Ruteando a través de código

	2.3. Protegiendo las rutas con guardas

3. Mostrando imagenes en Base64

## Interactuando con una API REST a través de HTTP. Observables 

Los datos a usar en nuestra aplicación van a estar almacenados en algún lado; en la nube, en un servidor en nuestra misma red, en nuestra pc de escritorio, etc. ¿Cómo hacemos para lograr traer esos datos y meterlos dentro de nuestras Views?

En este módulo aprenderemos a enviar HTTP requests con **Observables** para obtener datos. La mayoría de las aplicaciones hechas en Angular obtienen datos usando HTTP. ¿Cuál es el flujo que se da?

1. La aplicación envía una request a un servidor/web service (HTTP GET http://lupi.com/api/pets/2)

2. Ese Web Service obtiene los datos, seguramente accediendo a una base de datos.

3. El Web Service le contesta a la aplicación, con los datos obtenidos, en forma de una HTTP Response.

4. La aplicación procesa entonces los datos (por ej: los muestra en una View).

### Observables y las ‘Reactive Extensions’

Los Observables nos permiten manejar datos asincrónicos, como los datos que vendrán de nuestro *backend* o de algún *web service*.

Los mismos tratan a los eventos como una colección; podemos pensar a un Observable como un array de elementos que van llegando asincrónicamente a medida que pasa el tiempo. Hoy en día no tenemos Observables, estos son una feature propuesta para ES2016 (versión superior de JavaScript), por lo que para poder usarlos debemos utilizar una librería de terceros: **RxJS** o **Reactive Extensions**. No confundir esto con ReactJS.

Los **Observables** se usan incluso dentro de Angular, en su sistema de eventos o en su servicio HTTP (motivo por el cual lo estamos viendo).

A su vez, los **Observables** tienen métodos. La gracia de estos métodos es que, una vez se aplican sobre un **Observable**, estos realizan alguna transformación sobre el  **Observable** original, y lo retornan. Estos métodos siempre devuelven un **Observable**, permitiendo concatenar llamadas sobre un **Observable** de forma simple. Ejemplo: *map*, *filter*, *take*, *merge*, etc.

Una vez tengamos nuestros Observables, un método en nuestro código puede **suscribirse a un Observable**, para **recibir notificaciones asincrónicas a medida que nuevos datos vayan llegand**o. Dicho método puede entonces “reaccionar”, sobre esos datos. Dicho método a su vez es notificado cuando no hay más datos, o cuando un error ocurre.

### Observables vs Promises

Otra forma bastante común de obtener datos a través de HTTP es usando **promises**. Las promises/promesas son objetos de JavaScript que sirven para hacer computación asincrónica, representando un cierto valor que puede estar ahora, en el futuro o nunca. Estas permiten setear manejadores (funciones o callbacks), que ejecuten comportamiento una vez que el valor esté disponible. Las llamadas por HTTP, pueden ser manejadas a través de promesas. Esto permite que métodos asíncronicos devuelvan valores como si fueran sincrónicos: en vez de inmediatamente retornar el valor final, el método asincrónico devuelve una promesa de suministrar el valor en algún momento en el futuro.

Tanto Observables como Promises sirven para lo mismo, pero los Observables permiten hacer más cosas:

- Los Observables permiten **cancelar la suscripción**, mientras que las Promises no. Si el resultado de una request HTTP a un servidor o alguna otra operación costosa que es asincrónica no es más necesaria, el objeto **Suscription** sobre un Observable puede ser cancelado. 
- Las Promises manejan un único evento, cuando una operación asincrónica completa o falla. Los Observables son como los Stream (en muchos lenguajes), y permiten pasar cero o más eventos donde el callback será llamado para cada evento.
- En general, se suelen usar Observables porque permiten hacer lo mismo que las Promises y más.
- Los Observables proveen operadores como *map*, *forEach*, *reduce*, similares a un array.

### Tutorial: Consumiendo nuestra API

Como ya hemos vistos, los servicios de Angular son una excelente forma de encapsular lógica como la obtención de datos de un web service / backend, para que cualquier otro componente o service que lo precise lo use, a través de inyección de dependencias. En la clase anterior hicimos eso, pero manteniendo una lista hardcodeada de mascotas. En su lugar, queremos enviar una solicitud HTTP para obtener las mascotas. 

Angular provee un Servicio HTTP que nos permite llevar a cabo esto; donde luego de comunicarnos con el backend, cada vez que este nos responda, la respuesta llegará a nuestro servicio (PetService), en forma de Observable.

#### 1. Registramos el HttpModule en el AppModule

- En ```app.module.ts```, importamos el módulo que precisamos para hacer solicitudes Http.

```typescript
import { HttpModule } from '@angular/http';
```

A su vez necesitamos registrar el provider de ese service, en el Angular Injector. Como en muchos casos, esto ya viene hecho, gracias a que particularmente el módulo **HttpModule** lleva eso a cabo. Por ende, debemos agregarlo al array de imports de nuestro ```AppModule```.

```typescript
@NgModule({
  imports:      
  [ 
    BrowserModule, 
    FormsModule, 
    HttpModule, …
```

Recordemos que el array declarations es para declarar componentes, directivas y pipes que pertenecen a nuestro módulo. Mientras que el array imports es para obtener módulos de afuera.

#### 2. Armemos el cuerpo de nuestra llamada

Hagamos que ```getProducts``` devuelva una respuesta de tipo ```Observable<Response>```. Siendo Response una clase que contiene información de la respuesta HTTP.

Para ello, en ```pet.service.ts```, importamos la librería que nos permite trabajar con Observables (Reactive Extensions).

```typescript
import { Observable } from ‘rxjs/Observable’; 
```

Es importante notar que las llamadas HTTP son operaciones asincrónicas únicas, por lo que la secuencia Observable contiene sólo un elemento  del tipo Response. También precisamos hacer:

```typescript
import { Http, Response } from ‘@angular/http’;
```

Y ahora veamos esto, ¿realmente queremos "observar" Response enteras HTTP? A nosotros simplemente nos interesa obtener mascotas, no Responses. No queremos "observar" objetos del tipo Response.

Para cargar el operador map, tenemos que cargarlo usando import:

```typescript
import ‘rxjs/add/operator/map’;
```

Esta es una forma bastante inusual de cargar cosas: le dice al Module Loader que cargue una librería, sin particularmente importar nada. Cuando la librería se carga, su código JS se carga, cargándose para esta librería en particular, la función map para que quede disponible.

Para que esto funcione, en la consola deberíamos haber hecho:

```bash
npm install rxjs --save 
npm start
```

Y ahora, para mantener las cosas simples, hagamos que mismo nuestro Web Server retorne un JSON de las mascotas. Para ello creamos una nueva carpeta: ```src/api/pets```. Dentro de dicha carpeta, creamos un archivo ```test-api.json```, y le pegamos el siguiente JSON:

```json
[
    {
        "id": "1",
        "name": "Bobby",
        "age": 4,
        "size": "Grande",
        "birthDate": "",
        "weight": 20,
        "breed": "Golden Retriever",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Golden_Retriever_with_tennis_ball.jpg/1200px-Golden_Retriever_with_tennis_ball.jpg",
        "rating": 3
    },
    {
        "id": "2",
        "name": "Zeus",
        "age": 1,
        "size": "Grande",
        "birthDate": "",
        "weight": 18,
        "breed": "Husky",
        "imageUrl": "http://cdn3-www.dogtime.com/assets/uploads/gallery/siberian-husky-dog-breed-pictures/siberian-husky-dog-breed-pictures-5.jpg",
        "rating": 4
    },
        {
        "id": "3",
        "name": "Roberto",
        "age": 3,
        "size": "Mediano",
        "birthDate": "",
        "weight": 15,
        "breed": "Pug",
        "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/6/63/Mops-falk-vom-maegdebrunnen-internationaler-champion-fci.jpg",
        "rating": 5
    },
    {
        "id": "4",
        "name": "Batman",
        "age": 1,
        "size": "Mediano",
        "birthDate": "",
        "weight": 10,
        "breed": "French Bulldog",
        "imageUrl": "http://petful.supercopyeditors.netdna-cdn.com/wp-content/uploads/2016/06/french-bulldog.jpg",
        "rating": 5
    },
    {
        "id": "5",
        "name": "Bigotes",
        "age": 8,
        "size": "Mediano",
        "birthDate": "",
        "weight": 11,
        "breed": "Schnauzer",
        "imageUrl": "https://www.petdarling.com/articulos/wp-content/uploads/2014/08/schnauzer-perro.jpg",
        "rating": 5
    }
]
```

Finalmente:

- Definimos una constante que tenga la URL de nuestra WebApi (esto en su obligatorio va a cambiar).
- Inyectamos el servicio ```Http``` en nuestro ```PetService```.
- Cambiamos el tipo de ```getPets```, para que devuelva ```Observable<Response>```.
- Cambiamos el código de ```getPets``` para que llame al ```get``` del ```_httpService```.

La clase queda algo así:

```typescript
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
```

Sin embargo, como ya mencionamos antes, debemos usar la función ```map```. Nuestros componentes, como el ```PetListComponent```, esperan recibir una lista de mascotas (Pets), no de respuestas Http ```(Response)```. En consecuencia precisamos “traducir” cada response en un array de mascotas. Eso lo hacemos con el operador ```map```. Dicho operador lo que nos va a permitir es tomar la Response Http y convertirla en un array de Mascotas. El argumento que recibe dicha función es una Arrow Function, como ya hemos visto, que son simplemente lambda expressions, que transforma la respuesta en un JSON. 

Quedando algo así:

```typescript
  getPets(): Observable<Array<Pet>> {
        return this._httpService.get(this.WEB_API_URL)
        .map((response : Response) => <Array<Pet>> response.json());
    }
```

Ahora simplemente agregamos otro operador, para manejar errores. Esto es importante ya que muchísimas cosas pueden darse al querer comunicarse con un servicio de backend, desde una conexión perdida, una request inválida, etc. En consecuencia, agreguemos manejo de excepciones. 

Importamos los siguientes dos operadores:

```typescript
 import 'rxjs/add/operator/catch'; //para manejar excepciones
 import 'rxjs/add/operator/do'; //para hacer algo cada vez que llega una request (ej: loggear y ver que llegó.
```

Nos queda algo así:

```typescript
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
```

Finalmente, lo que hacemos es que nuestro componente ```PetListComponent``` se suscriba al resultado de la llamada (a los observables). Esto lo hacemos a través del método **```suscribe```**. Y cómo los Observables manejan múltiples valores a lo largo del tiempo, la función es llamada para cada valor que el Observable emite. En algunos casos queremos saber cuando el observable se completa, por lo que también podemos tener una función de completado (tercer argumento que es opcional, se ejecuta cuando se completa).

A su vez cuando queramos podemos cancelar la suscripción cuando queramos, con el objeto que nos devolvió al suscribirnos.

La idea es que nuestro componente sea notificado cada vez que un Observable emite un elemento, haciendo alguna acción particular para cada caso (OK, y Error). 

Vayamos al ```PetListComponent``` y en el ```OnInit```:

```typescript

  ngOnInit(): void {
        console.log("aca obtengo datos del backend!");
        this._petsService.getPets().subscribe(
            ((obtainedPets : Array<Pet>) => this.pets = obtainedPets),
            ((error : any) => console.log(error))
        )
    }
```    

IMAGEN MASCOTAS OBTENIDAS

IMAGEN DE LOG EN CONSOLA
    
## Conceptos avanzados de Routing

La otra clase habíamos visto los aspectos básicos de Routing. Ahora veremos algunas técnicas adicionales para manipular las rutas.

Por ahora solo podemos navegar a ciertas rutas y mostrar vistas, pero ese es un escenario muy básico. Por ejemplo cómo hacemos para pasar parámetros a una ruta? O cómo hacemos para activar rutas a través de código? O cómo hacemos para proteger rutas y permitir que solo ciertos usuarios o dadas ciertas condiciones dichas rutas sean visibles?

### Pasando parámetros a nuestras rutas

Pasar parámetros para las rutas. Veamos el ejemplo si quisiéramos ver el detalle de las mascotas:

#### 0. Creamos un PetDetailComponent:

```pet-detail.component.html```:

```html
<div class="panel panel-primary">
    <div class="panel-heading">
        {{pageTitle}}
    </div>
</div>
```

```pet-detail.component.ts```:

```typescript
import { Component } from '@angular/core';

import { Pet } from './pet';

@Component({
    templateUrl: "./pet-detail.component.html"
}) 
export class PetDetailComponent {
    pageTitle : string = 'Pet Detail';
    pet : Pet;
}
```

Y a su vez agregamos este componente en el AppModule, primero haciendo el import y luego agregando ```PetDetailComponent``` en el array de declarations:

```typescript
import { PetDetailComponent } from './pets/pet-detail.component';
```

```typescript
declarations: [ AppComponent, WelcomeComponent, PetListComponent,StarComponent, PetFilterPipe, PetDetailComponent],
```  

#### 1. Seteamos el path en app.module.ts (AppModule)

En este caso el path sería: *pets/id*, indicando que ruta a un componente **PetDetailComponent**. A su vez, le pasamos el parámetro id, con una barra y un dos puntos adelante (/:id). Si quisiéramos más parámetros, repetimos esto.

```typescript
   { path: 'pets/:id', component: PetDetailComponent },
```

#### 2. Ruteamos al path 

En el HTML de nuestro ***PetListComponent***,  ponemos un link (ancla) sobre el nombre, de manera de que cada vez que se haga click sobre el mismo, dicha ruta se resuelva y se le pase el parámetro asociado.

```html
  <td><a [routerLink]="['/pets', aPet.id]"> {{aPet.name | uppercase}} </a></td>
```

IMAGEN PET DETAIL VACIO CON RUTA

#### 3. Leemos los parámetros de la ruta n el PetDetailComponent

Leemos los parámetros de la ruta, usando el service ActivatedRoute de ‘@angular/router’.

Lo inyectamos en nuestro componente para que use este servicio (el provider ya viene resuelto por el RouterModule que usamos la clase anterior):

```typescript
constructor(private _currentRoute: ActivatedRoute) {  }
```

3. Agarramos el parámetro de la ruta y lo ponemos en una variable privada, dicha lógica lo haremos en el OnInit (hay que implementar OnInit).

```typescript
ngOnInit() : void {
	// let (es parte de ES2015) y define una variable que vive en este scope
	// usamos el nombre del parámetro que uamos en la configuración de la ruta y lo obtenemos
	let id =+ this._currentRoute.snapshot.params['id'];
	// definimos el string con interpolacion 
	this.pageTitle +=  `: ${id}`;
}
```

### Routing a través de código

Haremos Routing en código en lugar de hacerlo con la directiva **RouterLink** que hemos venido usando en el template.

Por ejemplo: un botón de Save que tiene que ejecutar cierto código una vez que se llenen campos, y recién ahí rutear (si todo salió satisfactoriamente). Para routear con código, usaremos el Router Service.

Recordemos, cada vez que inyectemos un servicio en una clase, tenemos que preguntarnos “registramos este servicio en el Angular Injector?”. En este caso, el provider ya viene dad por el RouterModule, por lo que no tenemos que hacerlo

#### 1. Importamos el Router Service (ProductDetailComponent)

En ProductDetailComponent:

```typescript
import { ActivatedRoute, Router } from '@angular/router';
```

#### 2. Inyectamos el servicio en la clase a través del constructor:

```typescript
    constructor(private _currentRoute: ActivatedRoute,
                private _router : Router) {  
    }
```

#### 3. Creamos una función que rutee a cierto path:

```typescript
  onBack(): void {
       this._router.navigate(['/pets']); //En caso de que necesite parametros los paso como otros argumentos
  }
```

#### 4. En el template de ProductDetail (HTML), creamos un botón para ir para atrás:

```html
<div class='panel-footer'>
	<a class='btn btn-default' (click)="onBack()" style="width:80px">
	    <i class='glyphicon glyphicon-chevron-left' ></i> Back
	</a>
</div>
```

## Protegiendo las rutas con guardas

Hay situaciones en las que queremos limitar el acceso a nuestras rutas; hacerlas que sean accesibles solo a ciertos usuarios (un Admin) o bajo ciertas condiciones. Para ello usamos **guardas**, el *Angular Router* provee varias guardas para llevar a cabo estas operaciones. Algunas de estas **route guards** son:

- ```CanActivate```: Guarda para navegar A una ruta
- ```CanDeactivate```: Guarda para navegar DESDE una ruta
- ```Resolve```: Para obtener datos antes de navegar a una cierta ruta (antes de activarla)
- ```CanLoad```: Para validar el routing asíncrono

Lo que haremos es construir una guarda que nos deje entrar el ```PetDetailComponent``` a menos que una cierta condición se cumpla. Las guardas se implementan como servicios, por lo que deben ser ```@Injectable()```. A diferencia de los otros servicios que hemos usados, los servicios de guardas deben ser provistos (puestos en el providers array del AppModule).

#### 1) Haremos algo muy simple, una guarda que prevenga la navegación al componente de detalle si la id que pasamos no es un número o es menor que cero.

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

#### 2) Vamos al AppModule y registramos el servicio en el providers array (luego de importarlo)

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
