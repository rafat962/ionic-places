import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTabBar, IonTabButton, IonLabel, IonIcon, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline,cardOutline,searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-places',
  templateUrl: './places.page.html',
  styleUrls: ['./places.page.scss'],
  standalone: true,
  imports: [IonTabs,CommonModule, IonIcon, IonLabel, IonTabButton, IonTabBar, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PlacesPage implements OnInit {

  constructor() {
    addIcons({ logOutOutline ,cardOutline,searchOutline});
  }

  ngOnInit() {
    console.log()
  }

}
