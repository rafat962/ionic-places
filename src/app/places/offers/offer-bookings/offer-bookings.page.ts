import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton,NavController } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,RouterModule]
})
export class OfferBookingsPage implements OnInit {
  place!:any;
  constructor( private route:ActivatedRoute,private navCtrl:NavController,private placesService:PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap=>{
      if(!paramMap.has('placeId')){
        this.navCtrl.back()
        return;
      }
      this.placesService.getPlace(paramMap.get('placeId')).subscribe((data)=>{
        this.place = data
        console.log(data)
      })
    })
  }

}
