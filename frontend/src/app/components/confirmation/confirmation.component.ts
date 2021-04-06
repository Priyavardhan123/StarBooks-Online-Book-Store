import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  username = ''
  books : any = []
  orders : any = []
  total_price = 0
  addresses : any = []

  constructor(private rest: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private _cookieService: CookieService) {
      this.username = this.route.snapshot.params.username;
    }

  ngOnInit(): void {


    if (this.username != this._cookieService.get('username') || this._cookieService.get('logged_in') != 'true' )
    {
      this._cookieService.set('username',"");
      this._cookieService.set('logged_in',"false");
      this.router.navigate(['/login']);
    }

    this.route.params.subscribe(res => {
      this.rest
        .get('http://localhost:3000/api/get_cart?username=' + this.username)
        .then(data => {
          if (data['success'])
          {
            this.orders = data['orders']   
            
            for ( var i=0 ; i<this.orders.length ; i++ )
              this.total_price += parseInt( this.orders[i].price ) 
            console.log(this.total_price);
            

            var book_ids = data['book_ids']
            book_ids.forEach(element => {
              this.rest.get('http://localhost:3000/api/get_book_by_id?id=' + element)
              .then( result => {
                if (result['success'])
                {
                  this.books.push(result['book'])
                  console.log(result['book']);
                }
              });
            });
          }
        });     
    });

    this.route.params.subscribe(res => {
      this.rest
        .get('http://localhost:3000/api/get_address?username=' + this.username)
        .then(data => {
          if (data['success'])
          {
            this.addresses = data['addresses']
            console.log(this.addresses);
          }
        });     
    });
  }

  async place_order() {
    this.rest
        .get('http://localhost:3000/api/place_order?username=' + this.username)
        .then(data => {
          if (data['success'])
          {
            console.log(data['message']);
            this.router.navigate(['/order_placed/' + this.username]);
          }
        }); 
  }
}
