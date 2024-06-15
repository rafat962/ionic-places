import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController, IonicModule, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,CreateBookingComponent]
})
export class PlaceDetailPage implements OnInit {
  isLoading = false
  constructor(private placesService:PlacesService,private navCtrl:NavController,private modalCtrl:ModalController,private alertCtrl:AlertController
    ,private route:ActivatedRoute, private router:Router ,private actionSheet: ActionSheetController,private bookingService:BookingService,private loadingCtrl:LoadingController
  , private authService:AuthService) { }
  place!:Place;
  isBookable = false;
  ngOnInit() {
    this.route.paramMap.subscribe(paramMap=>{
      if(!paramMap.has('placeId')){
        this.navCtrl.back()
        return;
      }
      this.isLoading = true
      this.placesService.getPlace(paramMap.get('placeId')).subscribe((data:any)=>{
        this.place = data
        this.isBookable = this.place.userId !== this.authService.userId
        this.isLoading = false
      },error =>{
        this.alertCtrl.create({
          header:'An error ocurred!',
          message:'Could not load place.',
          buttons:[{
            text:'Okay',
            handler:()=>{
              this.router.navigate(['/places/tabs/discover'])
            }
          }]
        }).then(alert=>{
          alert.present()
        })
      })
    })
  }

  onBookPlace(){
    // this.router.navigateByUrl('/places/tabs/discover')
    // this.navCtrl.back()
    this.actionSheet.create({
      header:'Choose an action',
      buttons:[
        {
          text:'Select Date',
          handler:()=>{
            this.openBookingModal('select')
          }
        },
        {
          text:'Random Date',
          handler:()=>{
            this.openBookingModal('random')
          }
        },
        {
          text:'Cancel',
          role:"cancel"
        }
      ]
    }).then(actionEl=>{
      actionEl.present()
    })

  }

  openBookingModal(mode:'select'|'random'){
    this.modalCtrl.create({component:CreateBookingComponent,componentProps:{selecedPlace:this.place,selectedMode:mode}}).then(modalEl=>{
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData=>{
      if(resultData.role === 'confirm'){
        this.loadingCtrl.create({message:'Booking place...'}).then(loadingEl=>{
          loadingEl.present()
          const data = resultData.data.bookingDate
          this.bookingService.addBooking(this.place.id,this.place.title,
            this.place.imageUrl,data.firstName,data.lastName,data.guestNumber,data.startDate,data.endDate).subscribe(data=>{
              loadingEl.dismiss()
            })
        })
      }
    })

}
}
