import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule  } from '@ionic/angular';
import { LoadingController} from '@ionic/angular';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AuthPage implements OnInit {
  isLogin = 'Login';
  constructor(private authService:AuthService,private route:Router,private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }
  async onSubmit(f:NgForm){
    if(f.invalid){
      return;
    }
    const email = f.value.email
    const password = f.value.password
    if(this.isLogin==='Login'){
      //Send a request to login servers
      const loadingCtrl = await this.loadingCtrl.create({keyboardClose:true,message:'Log In...',spinner:'circles'})
      loadingCtrl.present()
      this.authService.login(email,password).subscribe(data=>{
        console.log(data)
        this.loadingCtrl.dismiss()
        this.route.navigateByUrl('/places/tabs/discover')
      },err=>{
        console.log(err)
        loadingCtrl.dismiss()
      })
    } else {
      const loadingCtrl = await this.loadingCtrl.create({keyboardClose:true,message:'Sign Up...',spinner:'circles'})
      loadingCtrl.present()
      // Send request to signUp servers
      this.authService.signup(email,password).subscribe(data=>{
        console.log(data)
        loadingCtrl.dismiss()
        this.route.navigateByUrl('/places/tabs/discover')
      },err=>{
        console.log(err)
        loadingCtrl.dismiss()
      })
    }
  }
  onSwitchAuthMode(){
    if(this.isLogin='Login'){
      this.isLogin= 'Signup'
    }else{
      this.isLogin= 'Login'
    }

  }
}
