import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";
import { BehaviorSubject, delay, map, switchMap, take, tap } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";


interface BookingDaTA{
bookedFrom:string
bookedTo:string
firstName:string
guestNumber:number
lastName:string
placeId:string
placeImage:string
placeTitle:string
userId:string

}

@Injectable({ providedIn:'root' })

export class BookingService{
  constructor(private authService:AuthService,private http:HttpClient){}
  private _booking=new BehaviorSubject<Booking[]>( [])


  get bookings(){
    return this._booking.asObservable()
  }


  addBooking(placeId:string,title:string,placeImage:string,firstName:string,lastName:string,guestNumber:number,dateFrom:Date,dateTo:Date){
    let generatedId:string;
    const newBooking = new Booking(Math.random().toString(),
    placeId,
    this.authService.userId,
    title,placeImage,
    firstName,
    lastName,
    guestNumber,
    dateFrom,
    dateTo)
    return this.http.post<{name:string}>('https://ionic-angular-course-9f34b-default-rtdb.firebaseio.com/bookings.json', {...newBooking,id:null})
    .pipe(switchMap(resData=>{
      generatedId = resData.name;
      return this.bookings;
    }),take(1),tap(bookings =>{
      newBooking.id = generatedId;
      this._booking.next(bookings.concat(newBooking))
    }))
  }
  cancelBooking(bookingId:string){
    return this.http.delete(`https://ionic-angular-course-9f34b-default-rtdb.firebaseio.com/bookings/${bookingId}.json`)
    .pipe(switchMap(()=>{
      return this.bookings;
    }),take(1),tap(bookings =>{
      this._booking.next(bookings.filter(b => b.id!==bookingId))
    }))
  }

  fetchBookings(){
    return this.http.get<{[key:string]:BookingDaTA}>(`https://ionic-angular-course-9f34b-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`)
    .pipe(map( bookingData =>{
      const bookings = [];
      for(const key in bookingData){
        if(bookingData.hasOwnProperty(key)){
          bookings.push(new Booking(key,bookingData[key].placeId,bookingData[key].userId,bookingData[key].placeTitle,
            bookingData[key].placeImage,bookingData[key].firstName,bookingData[key].lastName,bookingData[key].guestNumber,
            new Date(bookingData[key].bookedFrom),new Date(bookingData[key].bookedTo)
          ))
        }
      }
      return bookings
    }),tap(bookings =>{
      this._booking.next(bookings)
    }))
  }



}
