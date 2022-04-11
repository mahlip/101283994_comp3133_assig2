import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.getIsAuthenticated()
    .pipe(distinctUntilChanged())
    .subscribe(getIsAuthenticated => {
      this.loggedIn = getIsAuthenticated
    });

    this.authService.getIsAdmin()
    .pipe(distinctUntilChanged())
    .subscribe(data => {
      this.isAdmin = data
      console.log("Admin Check ", this.isAdmin)
    });
  }

  logout() {

    this.authService.logout();
    this.router.navigate(['']);
  }

}
