import { Component, Input, OnInit } from '@angular/core';
import { Place } from '../../place.model';
import { RouterModule } from '@angular/router';
import {NavController, IonicModule,IonItemSliding } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { PlacesService } from '../../places.service';
@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
  standalone:true,
  imports:[RouterModule,IonicModule,CommonModule]
})
export class OfferItemComponent  implements OnInit {
  @Input() offer!:Place;
  constructor(private placeService:PlacesService) {
    addIcons({ calendar});
  }
  startDate !:Date
  ngOnInit() {}


  getDummyStartDate(){
    return new Date(this.offer.availableFrom)
  }
  getDummyEndDate(){
    return new Date(this.offer.availableTo)
  }

}
