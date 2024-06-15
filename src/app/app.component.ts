import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { business,checkboxOutline,exit } from 'ionicons/icons';
import { AuthService } from './auth/auth.service';
import { Plugins } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule,RouterModule],
})
export class AppComponent implements OnInit {
  constructor(private authService:AuthService,private route:Router) {
    addIcons({ business ,checkboxOutline,exit});
  }

  ngOnInit(): void {
    this.getLocation()
  }


  logOut(){
    this.authService.onLogout()
    this.route.navigateByUrl('/auth')
  }
  private getLocation(){
    Geolocation.getCurrentPosition().then(loac=>{
      console.log(loac)
    }).catch(err=>{
      console.log(err)
    })
  }
  }
