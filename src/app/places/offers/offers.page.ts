import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { add,create } from 'ionicons/icons';
import {NavController, IonicModule,IonItemSliding } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { addIcons } from 'ionicons';
import { OfferItemComponent } from './offer-item/offer-item.component';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule,OfferItemComponent ]
})
export class OffersPage implements OnInit {

  offers: any[]=[]
  isLoading = false
  constructor(private placesService: PlacesService,private router:Router) {
    addIcons({ add,create});
  }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.isLoading = true
    this.placesService.fetchPlaces().subscribe((data:any)=>{
      this.offers = data
      this.isLoading = false
      console.log(33)
      console.log(this.offers)
    })
  }
  onEdit(offerId:string,slidingItems:IonItemSliding){
    console.log(44)
    console.log(offerId)
    slidingItems.close()
    this.router.navigate(['/','places','tabs','offers',offerId])
  }
}
