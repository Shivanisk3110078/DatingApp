import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService { //service is a singletons which mean they are instantiated when our application starts and destroyed when our application shut down.
  //this account service is going to responsible for making the HTTP requests from our client to our server
  // why use a service for this? we have already proven that we can do this inside the component 
  //But using a service, it gives us an opportunity to centralize our HTTP requests.
  //But services are more capable than that and a service when it comes to angular, when it's providedIn the root module such as the AppModule
  //when our app is initialized then services are also initialized at the same time and the service is not destroyed until the user is finished with our application 
  //Let close the browser at that point the service gets destroyed.
  //Now that's different to a the component because as we create new components and a user moves between component to component to component,
  //each time that component is destroyed and anything that we'he stored inside there is also destroyed whereas the service lives for the lifetime of our application.
  //In future we will find this is a good place to store state that we want our application to remember , no matter where that user is in our app 
  baseUrl = 'https://localhost:5001/api/'

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model)

  }
}
