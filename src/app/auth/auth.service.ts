import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import{map, tap} from 'rxjs/operators'
import { Storage } from '@capacitor/storage';
import { User } from './user.model';
interface AuthResponseData {
  kind:string;
  idToken:string;
  email:string;
  refreshToken:string;
  localId:string;
  expireIn:Date;
  registerd?:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = false;

  private _userId = 'abc';

  get userIsAuthenticated(){
    return this._userIsAuthenticated
  }

  get userId(){
    return this._userId
  }

  user:any = new BehaviorSubject('')
  autoLogin(){
    return from(Storage.get({key:'authData'})).pipe(map(storedData=>{
      if(!storedData || !storedData.value){
        return null;
      }
      const parsedData = JSON.parse(storedData.value) as {token:string,tokenExpirationDate:string,userId:string,email:string}
      const expirationTime = new Date(parsedData.tokenExpirationDate)
      if(expirationTime <= new Date()){
        return null;
      }
      const user = new User(parsedData.userId,parsedData.email,parsedData.token,expirationTime)
      return User
    }),tap(user=>{
      if(user){
        this.user.next(user)
      }
    }),map(user=>{
      return !!user
    }))
  }


  constructor(private http:HttpClient) { }

  login(email:string,password:string){
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.fireBaseApiKey}`,{
      email:email,
      password:password,
      returnSecureToken:true
    })
  }

  signup(email:string,password:string){
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.fireBaseApiKey}`,{
      email:email,
      password:password,
      returnSecureToken:true
    }).pipe(tap(data=>{
      this.storeAuthData(data.localId,data.idToken,data.expireIn.toISOString(),data.email)
    }))
  }


  private storeAuthData(userId:string,token:string,tokenExpirationDate:string,email:string){
    const data = JSON.stringify({userId:userId,token:token,tokenExpirationDate:tokenExpirationDate,email:email})
    Storage.set({key:'authData',value:data })
  }
  onLogin(){
    this._userIsAuthenticated = true;
  }
  onLogout(){
    this._userIsAuthenticated = false;
    Storage.remove({key:'authData'})
}
}
