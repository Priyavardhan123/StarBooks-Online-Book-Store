import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserloginComponent } from './components/userlogin/userlogin.component';
import { UserregisterComponent } from './components/userregister/userregister.component';
import { CartComponent } from './components/cart/cart.component';
import { AddressComponent } from './components/address/address.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { OrderPlacedComponent } from './components/order-placed/order-placed.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

const routes: Routes = [
  {
    path: '',component: UserloginComponent
  },
  {
    path: 'login', component: UserloginComponent
  },
  {
    path: 'register', component: UserregisterComponent
  },
  {
    path: 'dashboard/:username', component: DashboardComponent
  },
  {
    path: 'cart/:username', component: CartComponent
  },
  {
    path: 'address/:username', component: AddressComponent
  },
  {
    path: 'confirmation/:username', component: ConfirmationComponent
  },
  {
    path: 'order_placed/:username', component:OrderPlacedComponent
  },
  {
    path: 'order_history/:username', component:OrderHistoryComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
