import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  username = ''
  orders: any ;
  cart: any = [];

  constructor(private rest: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private _cookieService : CookieService) {
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
            var book_ids = data['book_ids']
            book_ids.forEach(element => {
              this.rest.get('http://localhost:3000/api/get_book_by_id?id=' + element)
              .then( result => {
                if (result['success'])
                {
                  this.cart.push(result['book'])
                  console.log(result['book']);
                }
              });
            });
          }
        });     
    });
  }

  async remove_from_cart( id : String)
  {
    this.rest.post( 
      'http://localhost:3000/api/remove_from_cart',
        {
          id : id
        });
      location.reload();
  }
}
