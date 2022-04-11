import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private ADD_USER = gql`
  mutation Mutation(
      $username: String!,
      $firstname: String!,
      $lastname: String!,
      $password: String!,
      $email: String!,
      $type: String!
    ){
      addUser(
        username: $username,
        firstname: $firstname,
        lastname: $lastname,
        password: $password,
        email: $email,
        type: $type
        ){
      username
      firstname
      lastname
      email
      password
      type
    }
  }
  `
  signUpForm = new FormGroup({
    username: new FormControl(),
    firstname: new FormControl(),
    lastname: new FormControl(),
    password: new FormControl(),
    email: new FormControl(),
    type: new FormControl()
  })

  constructor(private router: Router, private apollo: Apollo) { }

  ngOnInit(): void {
  }

  signUp(){
    let tempUsername = this.signUpForm.get('username')?.value;
    let tempFirstname = this.signUpForm.get('firstname')?.value;
    let tempLastname = this.signUpForm.get('lastname')?.value;
    let tempEmail = this.signUpForm.get('email')?.value;
    let tempPassword = this.signUpForm.get('password')?.value
    let tempType = this.signUpForm.get('type')?.value;

    if (tempUsername == null) {
      tempUsername = '';
    }
    if (tempFirstname == null) {
      tempFirstname = '';
    }
    if (tempLastname == null) {
      tempLastname = '';
    }
    if (tempEmail == null) {
      tempEmail = '';
    }
    if (tempPassword == null) {
      tempPassword = ''
    }
    if (tempType == null) {
      tempType = '';
    }

    this.apollo.mutate({
      mutation: this.ADD_USER,
      variables: {
        username: tempUsername,
        firstname: tempFirstname,
        lastname: tempLastname,
        password: tempPassword,
        email: tempEmail,
        type: tempType,
      }
    }).subscribe((res: any) => {
      console.log('signup', res.data)
      this.router.navigate(['/login'])
    }, (err) => {
      alert(err.message)
    }) 

  }

}
