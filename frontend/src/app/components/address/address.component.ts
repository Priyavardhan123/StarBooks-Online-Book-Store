import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  username = ''
  house_no = ''
  street = ''
  locality = ''
  landmark = ''
  state = ''
  city = ''
  pin_code = 0
  addresses: any = []

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
        .get('http://localhost:3000/api/get_address?username=' + this.username)
        .then(data => {
          if (data['success'])
          {
            this.addresses = data['addresses']
            console.log(this.addresses);
            this.house_no = this.addresses[0].house_no;
            this.street = this.addresses[0].street_name;
            this.locality = this.addresses[0].locality;
            this.landmark = this.addresses[0].landmark;
            this.city = this.addresses[0].city;
            this.state = this.addresses[0].state;
            this.pin_code = this.addresses[0].pin_code;
          }
        });     
    });
  }

  async add()
  {
    if (this.house_no)
    {
      if (this.street)
      {
        if (this.city)
        {
          if (this.state)
          {
            if (this.pin_code)
            {
              this.rest.post( 
                'http://localhost:3000/api/add_address',
                  {
                    username : this.username,
                    house_no : this.house_no,
                    street_name : this.street,
                    landmark : this.landmark,
                    state : this.state,
                    city : this.city,
                    pin_code : this.pin_code,
                    locality : this.locality
                  });
                  location.reload();  
                }
                else  alert("Enter Pin code")
            }
            else  alert("Enter State")
          }
          else  alert("Enter City")
        }
        else  alert("Enter Street name")
      }
      else  alert("Enter House No.")
    }
    
    

  async change()
  {
    this.rest.post( 
      'http://localhost:3000/api/change_address',
        {
          username : this.username          
        });
        location.reload();  
  } 


}