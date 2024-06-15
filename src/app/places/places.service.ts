import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, delay, map, of, switchMap, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// new Place('p1',
//   'manhattan mansion',
//   'In the heart of New York',
//   'https://www.earthisland.org/images/uploads/hudson_river-web.jpg'
//   ,149.99,
// new Date('2019-01-01'),
// new Date('2019-12-31'),'abcaasd'),

// new Place('p2',
//   'Amour toujours',
//   'A romantic place in paris',
//   'https://images.ctfassets.net/cnu0m8re1exe/235oKMu6rdtDFsk80W2aPO/70e9c98a3c90f1ee7a874471ef989757/shutterstock_352720169.jpg?fm=jpg&fl=progressive&w=660&h=433&fit=fill'
//   ,189.99,
//   new Date('2019-02-02'),
//   new Date('2019-6-12'),'abc'),
// new Place('p3',
//   'the foggy place',
//   'A romantic place in paris',
//   'https://images.ctfassets.net/cnu0m8re1exe/235oKMu6rdtDFsk80W2aPO/70e9c98a3c90f1ee7a874471ef989757/shutterstock_352720169.jpg?fm=jpg&fl=progressive&w=660&h=433&fit=fill'
//   ,99.99,
//   new Date('2019-03-03'),
//   new Date('2019-7-14'),'abc'),
interface PlaceDate{
  availableFrom: string
  availableTo: string
  description: string
  imageUrl:string
  price: number
  title: string
  userId: string
}

@Injectable({
  providedIn: 'root',

})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([])

  get place(){
    return this._places.asObservable()
  }



  constructor(private authService:AuthService,private http:HttpClient) { }

  getPlace(id:any){
    return this.http.get<PlaceDate>(`https://ionic-angular-course-9f34b-default-rtdb.firebaseio.com/offered-places/${id}.json`)
    .pipe(map(placeData=>{
      return new Place(id,placeData.title,placeData.description,placeData.imageUrl,placeData.price,new Date(placeData.availableFrom),new Date(placeData.availableTo),placeData.userId)
    }))
  }

  fetchPlaces(){
    return this.http.get<{[key:string]:{PlaceDate: any}}>('https://ionic-angular-course-9f34b-default-rtdb.firebaseio.com/offered-places.json')
    .pipe(map((resData:any)=>{
      const Places = [];
      for(const key in resData){
        if(resData.hasOwnProperty(key)){
          Places.push(new Place(key,resData[key].title,resData[key].description,resData[key].imageUrl,resData[key].price,new Date(resData[key].availableFrom),new Date(resData[key].availableTo),resData[key].userId))
        }
        }
      return Places
    }),
  tap(places=>{
    this._places.next(places)
  }))
  }


  addPlace(title:string,description:string,price:number,dateFrom:any,dateTo:any){
    const newPlace = new Place(Math.random().toString(),title,description,  'https://images.ctfassets.net/cnu0m8re1exe/235oKMu6rdtDFsk80W2aPO/70e9c98a3c90f1ee7a874471ef989757/shutterstock_352720169.jpg?fm=jpg&fl=progressive&w=660&h=433&fit=fill'
  ,price,dateFrom,dateTo,this.authService.userId);
  let generatedId!:string;
  return this.http.post<{name:string}>('https://ionic-angular-course-9f34b-default-rtdb.firebaseio.com/offered-places.json',{...newPlace,id:null})
  .pipe(
    switchMap(resData=>{
      generatedId = resData.name
      return this._places
    }),
    take(1),
    tap((data)=>{
      newPlace.id = generatedId;
        this._places.next(data.concat(newPlace))
      })
  );
  // return this._places.pipe(take(1),delay(1000),tap((data)=>{
  //       this._places.next(data.concat(newPlace))
  // }))
  }
  updateOffer(placeId:string,title:string,description:string){
    let updatedPlaces:Place[];
    return this.place.pipe(take(1), switchMap(places=>{
      if(!places || places.length <=0){
        return this.fetchPlaces()
      } else {
        return of(places)
      }
    }),switchMap(places=>{
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      updatedPlaces = [...places]
      const ololdPlaced = updatedPlaces[updatedPlaceIndex]
      updatedPlaces[updatedPlaceIndex] = new Place(ololdPlaced.id,title,ololdPlaced.description,ololdPlaced.imageUrl,ololdPlaced.price,ololdPlaced.availableFrom,ololdPlaced.availableTo,ololdPlaced.userId)
      return this.http.put(`https://ionic-angular-course-9f34b-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,{...updatedPlaces[updatedPlaceIndex],id:null})
    }),tap(() =>{
      this._places.next(updatedPlaces)
    }))

  }


}
