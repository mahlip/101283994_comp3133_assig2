import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular'
import { AuthService } from '../services/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css']
})
export class AddBookingComponent implements OnInit {

  private ADD_BOOKING = gql`
  mutation
    addBooking(
      $listing_id: String!,
      $booking_id: String!,
      $booking_start: String!,
      $booking_end: String!,
    )
    {
      addBooking(
        listing_id: $listing_id,
        booking_id: $booking_id,
        booking_start: $booking_start,
        booking_end: $booking_end
      )
      {
        listing_id
        booking_id
        booking_date
        booking_start
        booking_end
        username
      }
    }
  `
  private GET_BOOKINGS = gql`
    query Query($userId: String!){
      getBookingsByUser(userId: $userId){
        listing_id
        booking_id
        booking_date
        booking_start
        booking_end
        username
      }
    }
  `

  list: any
  bookingForm: any;

  constructor(private apollo: Apollo, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  addBooking(){

    let tempUserId = this.authService.getUserId()
    let tempListId = this.list.listing_id
    let tempDate = Date.now()
    let tempBookingId = this.bookingForm.get('bookingId')?.value
    let tempStart = this.bookingForm.get('bookingStart')?.value
    let tempEnd = this.bookingForm.get('bookingEnd')?.value

    if (tempBookingId == null || tempStart == null || tempEnd == null || tempBookingId == '') {
      alert('Fields must be filled.');
    } else {
        if (tempStart > tempEnd) {
          alert('Invalid dates were set');
        } else {
          let formatStart = moment(tempStart).format('MM-DD-YYYY');
          let formatEnd = moment(tempEnd).format('MM-DD-YYYY');
          let formatDate = moment(tempDate).format('MM-DD-YYYY');

          this.apollo.mutate({
            mutation: this.ADD_BOOKING,
            variables: {
              userId: tempUserId,
              listingId: tempListId,
              bookingId: tempBookingId,
              bookingDate: formatDate.toString(),
              bookingStart: formatStart.toString(),
              bookingEnd: formatEnd.toString()
            },
            refetchQueries: [{
              query: this.GET_BOOKINGS,
              variables: {userId: this.authService.getUserId()}
            }]
          }).subscribe((res: any) => {
            this.router.navigate(['/history'])
          }, err => {
            console.log(err)
          })
          }

      }
  }
}
