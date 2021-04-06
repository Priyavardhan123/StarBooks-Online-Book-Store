import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  username = ''
  user_details : any;
  books : any;
  retailer_books : any = [];
  poetry_books : any = [];
  nonfiction_books : any = [];
  fiction_books : any = [];
  quantity = 0;
  query = '';

  book_name = ''
  author = ''
  category = ''
  price = ''
  image_path = ''
  is_available : boolean
  available : boolean
  image : any ;

  constructor(
    private rest: ApiService,
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
        .get('http://localhost:3000/api/get_user_details?username=' + this.username)
        .then(data => {
          data['success']
            ? (this.user_details = data['user'])
            : this.router.navigate(['/']);
          console.log(this.user_details);
        

          this.route.params.subscribe(res => {
            this.rest
              .get('http://localhost:3000/api/get_books')
              .then(data => {
                data['success']
                  ? (this.books = data['book'])
                  : this.router.navigate(['/']);
                // console.log(this.books);
                for ( var i = 0 ; i<this.books.length ; i++ )
                {
                  if (this.books[i].category == 'Poetry')
                    this.poetry_books.push(this.books[i]);
                  else if (this.books[i].category == 'Fiction')
                    this.fiction_books.push(this.books[i]);
                  else if (this.books[i].category == 'nonFiction')
                    this.nonfiction_books.push(this.books[i]);
                  if ( this.user_details[0].user_type == "retailer" && this.books[i].retailer == this.user_details[0].name)
                    this.retailer_books.push(this.books[i])
                };
                // console.log(this.poetry_books);
                // console.log(this.fiction_books);
                // console.log(this.nonfiction_books);
                // console.log(this.retailer_books);
              })
          });
        })
      });
  }

  async add_book()
  {
    console.log(this.book_name);
    console.log(this.category);
    console.log(this.price);
    if (this.is_available)
      this.available = true
    else
      this.available = false

    if (this.image)
      this.image_path = "assets/images/" + this.image.split('\\')[this.image.split('\\').length-1];

    if (this.category)
    {
      if (this.book_name)
      {
          if ( this.price)
          {
              if (this.image)
              {
                this.rest.post( 
                  'http://localhost:3000/api/add_book',
                    {
                      name : this.book_name,
                      author : this.author,
                      retailer : this.user_details[0].name,
                      price : this.price,
                      is_available : this.is_available,
                      image : this.image_path,
                      category : this.category,
                      contact : this.user_details[0].contact
                    });
                    location.reload();
                  // this.router.navigate(['/dashboard/' + this.username]);  
              }
              else  alert("Select Image");
          
          }
          else  alert("Enter Price");
      }
      else  alert("Enter book Name");
    }
    else  alert("Select category");
    
  }


  async remove_book( id: String) {
    this.rest.post( 
      'http://localhost:3000/api/remove_book',
        {
          id : id
        });
        location.reload();
  }

  async add_to_cart( book_id: String, book_price: String )
  {
    if ( this.quantity>0 )
    {
      this.rest.post( 
      'http://localhost:3000/api/add_to_cart',
        {
          username : this.username,
          book_id : book_id,
          status : "in_cart",
          date : new Date(),
          price : book_price,
          quantity : this.quantity
        });

        alert("book added to cart");
        this.quantity = 0;
      }
      else
        alert("Enter quantity greater than 0")
  }


}
