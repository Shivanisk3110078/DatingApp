import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {//service is a singletons which mean they are instantiated when our application starts and destroyed when our application shut down.
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
  private currentUserSource = new BehaviorSubject<User | null>(null) //We are going to use a special kind of observable for this called BehaviorSubject
  currentUser$ = this.currentUserSource.asObservable()                                               //which allows us to give an observable an initial value null so that we can then use outside AccountService.
                                                              //$ is a convention to signify that this is an observable
  constructor(private http: HttpClient) { }

  //Now we are going to use observable to persisting the login. This requires our application to remember something.
  //To do something with the data as it comes back from our API server, we are going to chain on the pipe and inside pipe we can do something with the observable as it comes back from the api.
  //And this is going to happen before the component subscription to this particular method

  login(model: User) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: any) => {//Now we are going to start to move away from using the any type now.We are going to introduce some type safety into our application.
        const user = response;//Now we know what we are going to get back from our API server. When a user login, we are going to get the username as well as the token. 
        if(user) {            //So, we are going to create a type that stores those two pieces of information.
          localStorage.setItem('user', JSON.stringify(user))    //As our browser localStorage only accept key/value pairs in terms of strings. 
          this.currentUserSource.next(user)
        }                                                 //So, we can't store an object there. We have to turn JSON objec into a string
      })//Now, currently when we login, we can store the information inside local storage. So, we are going to have access to that anywhere from our application.
    )  //So that we can get that if the user closes their browser and reopens it
  }  //We are also going to create an observable so that other components can use AccountService to ascertain whether or not a user is login

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe( //We do have to return from this register() method because our component needs to know if the request has been completed and that's why this is returning.
      map(user => { //But when we used map() and we project then if we want to return the response then we have to do it inside the map method. 
        if(user) {
          localStorage.setItem('user', JSON.stringify(user))
          this.currentUserSource.next(user)
        }
        // return user //if you need to use the value from map() function inside your component then you will need to return inside the map method as well.
      })
    )
  }

  setCurrentUser(user: User) { //We will use this one from our component 
    this.currentUserSource.next(user)

  }

  //Conversely, we're going to add a logout() method to our API so that when user logut then we take the opportunity to remove that item from local storage

  logout() {
    localStorage.removeItem('user')
    this.currentUserSource.next(null)
  }
}
