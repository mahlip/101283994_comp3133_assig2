import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private GET_ADMIN_LISTINGS = gql`
    query Query($username: String!){
        getListingsByAdmin{
          id
          listing_id
          listing_title
          description
          street
          city
          postal_code
          price
          email
          username
        }
      }
  `

  private querySubscription: Subscription | undefined;

  loading: boolean | undefined;

  allColumns: string[] = ['Price', 'Lister', 'Title', 'Description', 'Address'];

  listings: any[] = [];

  authenticated: boolean = false;

  constructor(private router: Router, private apollo: Apollo, private authService: AuthService) {
    this.authService.getIsAuthenticated().subscribe((res) => {
      this.authenticated = res;
    })

    this.getInfo();
   }

  ngOnInit(): void {

        this.getInfo();
  }

  getInfo() {
    this.apollo.watchQuery<any>({
      query: this.GET_ADMIN_LISTINGS,
      variables: {
       userId: this.authService.getUserId()
      }
    }).valueChanges
      .subscribe((res) => {
        this.listings = res.data.getListingsByAdmin
        console.log(this.listings)
      })
  }
  
}
