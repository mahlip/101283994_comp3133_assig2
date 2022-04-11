import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {

  allColumns: string[] = ['id', 'createDate', 'startDate', 'endDate', 'username']

  bookings: any[] = [];

  authenticated = false;

  private GET_BOOKINGS = gql`
    query Query($userId: String!){
      getBookings{
        listing_id
        booking_id
        booking_date
        booking_start
        booking_end
        username
      }
    }
  `

  constructor(private apollo: Apollo, private authService: AuthService, private router: Router) {
    this.authService.getIsAuthenticated().subscribe((res) => {
      this.authenticated = res;
    })

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.getBookings();
      }
    })

    this.getBookings();
   }

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.getBookings();
      }
    })
  }

  getBookings(){
    this.apollo.watchQuery({
      query: this.GET_BOOKINGS,
      variables: {
        userId: this.authService.getUserId()
      }
    }).valueChanges.subscribe((res: any ) => {
      this.bookings = res.data.getBookingsByUser;
      console.log(this.bookings);
    }, (err) => {
      alert(err);
    });
  }

}
