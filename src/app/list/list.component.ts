import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavigationEnd, Router, Event, NavigationExtras } from '@angular/router';
import { Apollo, gql } from 'apollo-angular'
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  private GET_LISTING_BY_POSTAL_CODE = gql`
  query Query($postal_code: String!){
    getListingByPostalCode(postal_code: $postal_code){
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
  private GET_LISTING_BY_CITY = gql`
  query Query($city: String!){
      getListingByCity(city: $city){
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
  private GET_LISTING_BY_USERNAME = gql`
  query Query($username: String!){
    getListingByUsername(username: $username){
      listing_id
      listing_title
      description
      street
      city
      postal_code
      price
      listingEmail
      listingUsername
    }
  }
  `
  private GET_LISTINGS = gql`
  query{
    getListings{
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
  searchForm = new FormGroup({
    search: new FormControl(),
    condition: new FormControl()
  });

  anyColumns: string[] = ['Price', 'Lister', 'Title', 'Description', 'Address'];
  userColumns: string[] = ['Price', 'Lister', 'Title', 'Description', 'Address', 'Book'];

  authenticated = false;

  listings: any[] = [];

  constructor(private apollo: Apollo, private authService: AuthService, private router: Router) {
    this.authService.getIsAuthenticated().subscribe((res) => {
      this.authenticated = res;
    })

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.getListings();
      }
    })

    this.getListings();
  }

  ngOnInit(): void {
    this.router.events.subscribe((event : Event) => {
      if(event instanceof NavigationEnd){
        this.getListings()
      }
    })
  }

  getListings(){
    this.apollo.watchQuery({
      query: this.GET_LISTINGS
    }).valueChanges.subscribe((res: any) => {
      this.listings = res.data.getListings
      console.log(this.listings)
    })
  }

  search(){
    let tempSearch = this.searchForm.get('search')?.value
    let tempCriteria = this.searchForm.get('criteria')?.value

    if( tempSearch == null || tempCriteria == null){
      alert('Please enter your search in the search bar')
    } else{
      if (tempCriteria == 'name') {
        this.searchName(tempSearch);
      }
      if (tempCriteria == 'city') {
        this.searchCity(tempSearch);
      }
      if (tempCriteria == 'postalCode') {
        this.searchPostalCode(tempSearch);
      }
    }
  }

  searchName(search: any){
    this.apollo.watchQuery({
      query: this.GET_LISTING_BY_USERNAME,
      variables:{
        name:search
      }
    }).valueChanges.subscribe((result: any) => {
      this.listings = result?.data?.getListingsByUsername
    })
  }

  searchCity(search: any){
    this.apollo.watchQuery({
      query: this.GET_LISTING_BY_CITY,
      variables: {
        name:search
      }
    }).valueChanges.subscribe((result: any) => {
      this.listings = result?.data?.getListingByCity
    })
  }

  searchPostalCode(search: any){
    this.apollo.watchQuery({
      query: this.GET_LISTING_BY_POSTAL_CODE,
      variables: {
        name: search
      }
    }).valueChanges.subscribe((result: any) => {
      this.listings = result?.data?.getListingsByPostalCode
    })
  }

  addBooking(index: any){
    let navExtras: NavigationExtras = {
      state: {
        list: this.listings[index]
      }
    };
    this.router.navigate(['/addBook'], navExtras)
  }

}
