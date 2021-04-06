import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-userregister',
  templateUrl: './userregister.component.html',
  styleUrls: ['./userregister.component.css']
})
export class UserregisterComponent implements OnInit {

  name = ''
  email = ''
  username = ''
  contact = ''
  pass = ''
  con_pass = ''
  user_type = ''

  constructor( 
    private rest: ApiService,
    private router: Router) {
  }

  ngOnInit(): void {

  }

  async onSubmit() 
  {
    if (this.user_type)
    {
      if (this.name)
      {
        if (this.username)
        {
          if (this.email)
          {
            if (this.contact)
            {
              if (this.pass)
              {
                if (this.con_pass)
                {
                  if (this.pass === this.con_pass)
                  {
                    this.rest.post( 
                      'http://localhost:3000/api/register',
                        {
                          name : this.name,
                          username : this.username,
                          pass : this.pass,
                          email : this.email,
                          contact : this.contact,
                          user_type : this.user_type
                        });
                      this.router.navigate(['/login']);                  
                  }
                  else
                    alert("Password donot match");
                }
                else  alert("Confirm Password");
              }
              else  alert("Enter password");
            }
            else  alert("Enter contact number");
          }
          else  alert("Enter E-mail");
        }
        else  alert("Enter Username");
      }
      else  alert("Enter Name")
    }
    else  alert("Select User type")
  }
}
