import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.css']
})
export class AddListingComponent implements OnInit {

  private ADD_LISTING = gql`
  mutation Mutation(
    $listing_id: String!,
    $listing_title: String!,
    $description: String!,
    $street: String!,
    $city: String!,
    $postal_code: String!,
    $price: Float!,
    $email: String!,
    $username: String!){ 
    addListing(
      listing_id: $listing_id, 
      listing_title: $listing_title,
      description: $description, 
      street: $street,
      city: $city, 
      postal_code: $postal_code,
      price: $price, 
      email: $email, 
      username: $username)
    {
      listing_id
      listing_title
      description
      street
      postal_code
      price
      email
      username
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

  listForm = new FormGroup({
    listing_id: new FormControl(),
    listing_title: new FormControl(),
    description: new FormControl(),
    street: new FormControl(),
    city: new FormControl(),
    postal_code: new FormControl(),
    price: new FormControl()
  })

  constructor(private router: Router, private apollo: Apollo, private authService: AuthService) { }

  ngOnInit(): void {
  }

  addListing(){
    let tempUserId = this.authService.getUserId();
    let tempListId = this.listForm.get('listing_id')?.value;
    let tempTitle = this.listForm.get('listing_title')?.value;
    let tempDescription = this.listForm.get('description')?.value;
    let tempStreet = this.listForm.get('street')?.value;
    let tempCity = this.listForm.get('city')?.value;
    let tempPostalCode = this.listForm.get('postal_code')?.value;
    let tempPrice = this.listForm.get('price')?.value;
    let parsedPrice;

    if(tempListId == null){
      tempListId = ''
    }
    if(tempTitle == null){
      tempTitle = ''
    }
    if(tempDescription == null){
      tempTitle = ''
    }
    if (tempStreet == null) {
      tempStreet = ''
    }
    if (tempCity == null) {
      tempCity = ''
    }
    if (tempPostalCode == null) {
      tempPostalCode = ''
    }

    if(isNaN(tempPrice)){
      alert('Please enter a number value for price')
    } else {
      parsedPrice = parseFloat(tempPrice)

      this.apollo.mutate({
        mutation: this.ADD_LISTING,
        variables: {
          user_id: tempUserId,
          listing_id: tempListId,
          listing_title: tempTitle,
          description: tempDescription,
          street: tempStreet,
          city: tempCity,
          postalCode: tempPostalCode,
          price: parsedPrice
        },
        refetchQueries: [
          {
            query: this.GET_ADMIN_LISTINGS,
            variables: {userId: this.authService.getUserId()}
          },
          {
            query: this.GET_LISTINGS
          }
        ]
      }).subscribe((res: any) => {
        console.log('data', res)
        this.router.navigate(['/admin'])
      }, (err) => {
        alert(err)
      })
    }


  }
}
