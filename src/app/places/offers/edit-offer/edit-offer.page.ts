import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController, LoadingController,AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { checkmark } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, FormsModule, CommonModule]
})
export class EditOfferPage implements OnInit {
  place: any;
  placeId: any;
  myform!: FormGroup;
  isLoading = false;

  constructor(private route: ActivatedRoute,private alertCtrl:AlertController, private placesService: PlacesService, private loadingCtrl: LoadingController, private navCtrl: NavController, private router: Router) {
    addIcons({ checkmark });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;

      // Initialize the form
      this.myform = new FormGroup({
        title: new FormControl(''),
        price: new FormControl(''),
        description: new FormControl(''),
        imageUrl: new FormControl(''),
      });

      this.placesService.getPlace(paramMap.get('placeId')).subscribe((data: any) => {
        this.place = data;

        // Use patchValue instead of setValue
        this.myform.patchValue({
          title: this.place.title,
          price: this.place.price,
          description: this.place.description,
          imageUrl: this.place.imageUrl
        });

        this.isLoading = false;
      });
    });
  }

  sendEdit() {
    console.log(this.myform.value);
    this.loadingCtrl.create({
      message: 'Updating place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updateOffer(this.place.id, this.myform.value.title, this.myform.value.description)
        .subscribe(() => {
          loadingEl.dismiss();
          this.myform.reset();
          this.router.navigate(['/places/tabs/offers']);
        },error=>{
          this.alertCtrl.create({
            header:'An error occurred!',
            message:'Place could not be fearched. please try again later.',
            buttons:[{
              text:'Okay',
              handler:()=>{
                this.router.navigate(['/places/tabs/offers']);
              }
            }]
          }).then(alert=>{
            alert.present()
          })
        });
    });
  }
}
