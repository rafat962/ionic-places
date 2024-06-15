import { ImagePickerComponent } from './../../../shared/image-picker/image-picker.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmark } from 'ionicons/icons';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
function base64toBlob(base64Data: string, contentType: string) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}
@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule,ImagePickerComponent]
})

export class NewOfferPage implements OnInit {
  form!:FormGroup;
  constructor(private placeService:PlacesService,private router:Router,private loaderCtrl:LoadingController) {
    addIcons({ checkmark});
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      }),
      description: new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required,Validators.maxLength(180)]
      }),
      price: new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required,Validators.min(1)]
      }),
      dateFrom: new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      }),
      dateTo: new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      }),
      image: new FormControl(null)
    })
  }

  onCreateOffer(){
    this.loaderCtrl.create({
      message:'Creating place...'
    }).then(loadingEl=>{
      loadingEl.present()
      this.placeService.addPlace(this.form.value['title'],this.form.value['description'],+this.form.value['price'],
        this.form.value['dateFrom'],
        this.form.value['dateTo']
      ).subscribe((data:any)=>{
        this.form.reset()
        this.router.navigate(['/places/tabs/offers'])
        loadingEl.dismiss();
      })
    })
  }

  onImagePicked(imageData:string){
    try{
      const imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64,',''),'image/jpeg')
      this.form.patchValue({image:imageFile})
    }catch(err:any){
      console.log(err)
      return;
    }
  }
}
