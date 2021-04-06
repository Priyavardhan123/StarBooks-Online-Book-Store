import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css']
})
export class UserloginComponent implements OnInit {

  username = ''
  password = ''
  user_type = ''
  cookie_value: any

  constructor(
    private rest: ApiService,
    private router: Router,
    private _cookieService: CookieService) { }

  ngOnInit(): void {
    this._cookieService.set('username',"");
    this._cookieService.set('logged_in',"false");
  }

  async login(){
    if (this.user_type)
    {
      if (this.username)
      {
        if (this.password)
        {
          var data = this.rest.post( 
            'http://localhost:3000/api/login',
              {
                username : this.username,
                password : this.password,
                user_type : this.user_type
              });
              console.log((await data).valueOf()['success']);
              if ( (await data).valueOf()['success']=="true" )
              {
                this.router.navigate(['/dashboard/'+this.username]);
                this._cookieService.set('username', this.username);
                this._cookieService.set('logged_in', 'true');
              }
              else
                alert((await data).valueOf()['message'])
              
        }
        else  alert("Enter password")
      }
      else  alert("Enter username")
    }
    else  alert("Enter user type")
  }

}
