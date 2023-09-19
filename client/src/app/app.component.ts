import { Component, OnInit } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Dating app';

  constructor(private accountService: AccountService) {}

  //OBSERVABLE --> Stream Of Data
  //OBSERVABLE are LAZY by nature
  //So to observe an observable, we need to subscribe to it and this is going to force our request to go and get the data.

  ngOnInit(): void {
    this.setCurrentUser()
  }

  setCurrentUser() {
    // const user: User = JSON.parse(localStorage.getItem('user')!)
    const userString = localStorage.getItem('user')
    if(!userString) return
    const user: User = JSON.parse(userString)
    this.accountService.setCurrentUser(user)
  }
}
