import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { GraphqlProductsService} from '../graphql.products.service';
import { Subscription } from 'rxjs';
import { GraphqlUsersService} from '../graphql.users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  itemCount: number = 0;
  btnText: string = 'Add an item';
  goalText: string = 'My first life goal';
  goals: Array<any> = [];
  user: string = "";
  pass: string = "";
  token: string = "";
  loading: boolean;

  private querySubscription: Subscription;

  constructor(private _data: DataService, 
	      private graphqlProductsService: GraphqlProductsService,
              private graphqlUsersService : GraphqlUsersService) { }

  ngOnInit() {
    this.itemCount = this.goals.length;
    
    this.querySubscription = this.graphqlProductsService.links("-")
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.goals = JSON.parse(JSON.stringify(data)).links;
        console.log(JSON.stringify(this.goals))
      });
  }

  addItem() {
    /*this.goals.push(this.goalText);*/

    var mytoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRhcmlvIiwiZXhwIjoxNjM1OTc5MzMyLCJvcmlnSWF0IjoxNjM1OTc5MDMyfQ.Aj_g6sW6qF79qW3YhArGwrdcEaqhsYUmhHjerrciLx0";
    //this.storageService.getSession("token");
    alert(this.goalText);

    this.graphqlProductsService.createLink(mytoken, "https://www.github.com", this.goalText)
    .subscribe(({ data }) => {
       console.log('link created :  ', data);
    }, (error) => {
       console.log('there was an error sending the query', error);
    });

    this.goalText = '';
    this.itemCount = this.goals.length;
    this._data.changeGoal(this.goals);
  }

  loginUser() {

    alert(this.user + " - " + this.pass);
    this.graphqlUsersService.tokenAuth(this.user, this.pass)
    .subscribe(({ data }) => {
       console.log('logged: ', JSON.stringify(data));
      // this.storageService.setSession("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);
      //this.storageService.setLocal("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);
      this.token =  JSON.parse(JSON.stringify(data)).tokenAuth.token;


      //this.loginService.showData(mydata);
      // this.router.navigate(['/']);

    }, (error) => {
       console.log('there was an error sending the query', error);
    });

  }

  removeItem(i: any) {
    this.goals.splice(i, 1);
    this._data.changeGoal(this.goals);
  }

}
