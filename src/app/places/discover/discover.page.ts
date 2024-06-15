import { Component, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ScrollingModule
  ]
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[] = []
  listLoadedPlaces:Place[] = []
  relevantPlaces:Place[]=[]
  isLoading = false
  constructor(private placesService: PlacesService,private authService:AuthService) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.isLoading= true
    this.placesService.fetchPlaces().subscribe((data:any)=>{
      this.loadedPlaces = data
      this.relevantPlaces = this.loadedPlaces
      this.listLoadedPlaces = this.relevantPlaces.slice(1)
      this.isLoading = false
    })
  }

  onFilterUpdate(event:CustomEvent<SegmentChangeEventDetail>){
    console.log(event.detail);
    if(event.detail.value === 'all'){
      this.relevantPlaces = this.loadedPlaces;
      this.listLoadedPlaces = this.relevantPlaces.slice(1);
    }else{
      this.relevantPlaces = this.loadedPlaces.filter(place => place.id !== this.authService.userId)
      this.listLoadedPlaces = this.relevantPlaces.slice(1);
    }
  }

}
