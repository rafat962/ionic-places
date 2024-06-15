import { IonicModule } from '@ionic/angular';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  standalone:true,
  imports:[IonicModule,CommonModule]
})
export class ImagePickerComponent  implements OnInit {



  constructor() {
    addIcons({camera});
  }

  ngOnInit() {}
  @Output() imagePick = new EventEmitter<string>();
  selectedImage!:any;
  onPickImage() {
    Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64 // Use Base64 to get a base64 string representation
    }).then(image => {
      // Log base64 string (optional)
      console.log('Base64 String:', image.base64String);

      // Emit the base64 string to parent component
      this.selectedImage = `data:image/jpeg;base64,${image.base64String}`;
      this.imagePick.emit(this.selectedImage);
    }).catch(error => {
      console.error('Camera error:', error);
    });
  }
  // onPickImage() {
  //   Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: true,
  //     resultType: CameraResultType.Uri // Ensure you're using Uri to get the file path
  //   }).then(image => {
  //     console.log('Original File Path:', image.webPath);
  //     this.selectedImage = `data:image/jpeg;base64,${image.base64String}`;
  //     this.imagePick.emit(this.selectedImage);
  //   }).catch(error => {
  //     console.error('Camera error:', error);
  //   });
  // }


  }



