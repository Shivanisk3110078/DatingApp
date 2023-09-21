import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit{

  model: any = {}  //create a property to store what the user completes in the form
  // loggedIn = false  //specify whether or not the user is loggedIn
  //So we are going to take a look at how we can use the async pipe.
  //So, one way we could do this is we can add a property in our component and we are going to remove this loggedIn flag now.
  //And instead of that we are going to specify currentUser$ to represent the fact this is an observable.

  // currentUser$: Observable<User | null> = of(null)

  //We have got a bit of noise in our component and we can get around this by using the accountService directly inside our template. 

  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    // this.getCurrentUser()
    // this.currentUser$ = this.accountService.currentUser$ //This is pointless and unnecessary because we already have the currentUser$ observable in the accountService
  }
  
  // When you subscribe to your own define obsevable then it is best practice to unsubscribe that observable as well otherwise there is chances of memory leak(not applicable for HTTP request).
  //Now, we can take care of that in component but there is a better way of going about this and that is to use async pipe in our template.
  //And when we use the async pipe then that's going to automatically subscribe and unsubscribe for us.So, we don't need to write the code to do so.
  // getCurrentUser() {
  //   this.accountService.currentUser$.subscribe({
  //     next: user => this.loggedIn = !!user,  //this turns our user object into a boolean by using !! and if we have a user that's going to return true else false
  //     error: error => console.log(error)
      
  //   })
  // }

  login(){
    // console.log(this.model)
    this.accountService.login(this.model).subscribe({
      next: response => { //{} will allow us to put multiple statements inside what we want to do with this response
        // console.log(response)
        this.router.navigateByUrl('/members')
        // this.loggedIn = true  //if there is a problem with the user loggedIn then we are going to do something with the error as well
      },
      error: error => this.toastr.error(error.error)
    })
  }
  logout() {
    this.accountService.logout()
    this.router.navigateByUrl('/')
    // this.loggedIn = false
  }


}
