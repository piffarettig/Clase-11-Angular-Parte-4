import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'da2-star', //le ponemos un nombre reusable (nuestra compañia)
    templateUrl: './star.component.html',
    styleUrls: ['./star.component.css']
})
export class StarComponent implements OnChanges {
   @Input() rating: number; 
    starWidth: number;

    @Output() ratingClicked: EventEmitter<string> = new EventEmitter<string>();

    ngOnChanges():void {
        //86 es el width de nuestras estrellitas (ver el template)
        console.log("onchanges!");
        console.log(this.rating);
        this.starWidth = this.rating * 86/5; 
    }

    onClick(): void {
        this.ratingClicked.emit(`El puntaje ${this.rating} fue clickeado!`);
    }
}
