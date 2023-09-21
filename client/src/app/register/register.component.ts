import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  //Our goal is pass down our users from home component to register component which is a child of home component.
  //That mean we need to look at input property

  // @Input() usersFromHomeComponent: any    //get users information from parent component
  @Output() cancelRegister = new EventEmitter() //emit something from child component to parent component(communication from child to parent component)
  model: any = {}
 

  constructor(private accountService: AccountService, private toastr: ToastrService) {}

  ngOnInit(): void {
  }

  register() {
    // console.log(this.model)
    this.accountService.register(this.model).subscribe({
      next: () => {
        // console.log(response)
        this.cancel()
      },
      error: error => {
        this.toastr.error(error.error)
        console.log(error)
      }
    })
  }

  cancel() {
    // console.log('cancelled')
    this.cancelRegister.emit(false)
  }

}
