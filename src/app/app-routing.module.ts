import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { LoginComponent } from './login/login.component'; 
import { ListComponent } from './list/list.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { AdminComponent } from './admin/admin.component';
import { AddListingComponent } from './add-listing/add-listing.component';
import { AuthGuardService } from './services/auth-guard.service';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'history',
    component: BookingHistoryComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuardService],
    data: {roles: 'admin'}
  },
  {
    path: 'addBook',
    component: AddBookingComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'addList',
    component: AddListingComponent,
    canActivate: [AuthGuardService],
    data: {roles: 'admin'}
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }