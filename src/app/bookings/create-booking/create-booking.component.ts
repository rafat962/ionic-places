import { IonicModule,ModalController } from '@ionic/angular';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Place } from 'src/app/places/place.model';
import {close } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
  standalone:true,
  imports:[IonicModule,FormsModule,CommonModule]
})
export class CreateBookingComponent  implements OnInit {
  @Input() selecedPlace!:Place;
  @Input() selectedMode : any;
  @ViewChild('f') form!:NgForm;
  startDate!:any;
  endDate!:any;
  constructor(private modalCtrl:ModalController) {
    addIcons({ close});
  }

  ngOnInit() {
    const availableFrom = new Date(this.selecedPlace.availableFrom)
    const availableTo = new Date(this.selecedPlace.availableTo)
    if( this.selectedMode === ' random' ){
      this.startDate = new Date(availableFrom.getTime() + Math.random() * (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())).toISOString();
      this.endDate = new Date(this.startDate.getTime() + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString()
    }
    console.log(this.startDate)
  }
  onCancle(){
    this.modalCtrl.dismiss(null,'cancel')
  }
  onBookPlace(){
    if(!this.form.valid || !this.datesValid){
      return;
    }

    this.modalCtrl.dismiss({bookingDate:{
      firstName : this.form.value['first-name'],
      lastName : this.form.value['last-name'],
      guestNumber : +this.form.value['guest-number'],
      startDate : new Date(this.form.value['date-from']),
      endDate : new Date(this.form.value['date-to']) ,
    }},'confirm')
  }
  datesValid(){
    const startDate = new Date(this.form.value['date-from'])
    const endDate = new Date(this.form.value['date-to'])
    return endDate > startDate
  }
}
