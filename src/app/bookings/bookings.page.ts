import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonItemSliding, LoadingController } from '@ionic/angular';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BookingsPage implements OnInit,OnDestroy {
  loadedBookings!: Booking[];
  isLoading = false
  private bookingSub!:Subscription;
  constructor(private bookingService:BookingService,private loadingCtrl:LoadingController) {
    addIcons({ trash });
  }
  ngOnInit() {
    this.bookingSub =  this.bookingService.bookings.subscribe(booking=>{
      this.loadedBookings = booking
    })
  }
  ionViewWillEnter(){
    this.isLoading = true
    this.bookingService.fetchBookings().subscribe(()=>{
    this.isLoading = false
  })
  }
  ngOnDestroy(): void {
    this.bookingSub.unsubscribe()
  }


  onCancelBooking(bookingId:string,slidingEl:IonItemSliding){
    slidingEl.close();
    this.loadingCtrl.create({
      message:'Cancelling...'
    }).then(loadingEl=>{
      loadingEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe(()=>{
        loadingEl.dismiss()
      })
    })
  }


}
