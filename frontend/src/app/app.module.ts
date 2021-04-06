import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserloginComponent } from './components/userlogin/userlogin.component';
import { UserregisterComponent } from './components/userregister/userregister.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CartComponent } from './components/cart/cart.component';
import { AddressComponent } from './components/address/address.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { OrderPlacedComponent } from './components/order-placed/order-placed.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UserloginComponent,
    UserregisterComponent,
    DashboardComponent,
    CartComponent,
    AddressComponent,
    ConfirmationComponent,
    OrderPlacedComponent,
    OrderHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
