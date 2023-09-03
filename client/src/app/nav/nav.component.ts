import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {}  //create a property to store what the user completes in the form
  loggedIn = false  //specify whether or not the user is loggedIn

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  login(){
    // console.log(this.model)
    this.accountService.login(this.model).subscribe({
      next: response => { //{} will allow us to put multiple statements inside what we want to do with this response
        console.log(response)
        this.loggedIn = true  //if there is a problem with the user loggedIn then we are going to do something with the error as well
      },
      error: error => console.log(error)
    })
  }
  logout() {
    this.loggedIn = false
  }

}
