import { NgModule } from "@angular/core";
import { Route, RouterModule, Routes } from "@angular/router";
import { PlacesPage } from "./places.page";
import { DiscoverPage } from "./discover/discover.page";
import { PlaceDetailPage } from "./discover/place-detail/place-detail.page";
import { OffersPage } from "./offers/offers.page";
import { NewOfferPage } from "./offers/new-offer/new-offer.page";
import { EditOfferPage } from "./offers/edit-offer/edit-offer.page";
import { OfferBookingsPage } from "./offers/offer-bookings/offer-bookings.page";

export const routes:Route[]=[
  {
    path:'tabs',
    component:PlacesPage,
    children:[
      {
        path:'discover',
        children:[
          {
            path:'',
            component:DiscoverPage
          },
          {
            path:':placeId',
            component:PlaceDetailPage
          },
          {
            path:'',
            redirectTo:'/places/tabs/discover',
            pathMatch:'full'
          }
        ]
      },
      {
        path:'offers',
        children:[
          {
            path:'',
            component:OffersPage
          },
          {
            path:'new',
            component:NewOfferPage
          },
          {
            path:'edit/:placeId',
            component:EditOfferPage
          },
          {
            path:':placeId',
            component:OfferBookingsPage
          }
        ]
      }
    ]
  },
  {
    path:'',
    redirectTo:'/places/tabs/discover',
    pathMatch:'full'
  }
]

