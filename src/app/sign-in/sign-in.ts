import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '../providers/authentication.provider';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.scss']
})
export class SignInPage implements OnInit {
  email: string;
  pwd: string;
  message: string;

  constructor(
    private router: Router,
    private authProvider: AuthenticationProvider
  ) {
  }

  ngOnInit() {
  }

  signIn() {
    this.message = '';
    this.authProvider.signIn(this.email, this.pwd).then(() => {
      this.router.navigate(['investments']);
    }).catch(err => {
      console.log(err);
      this.message = err.message;
    });
  }

}
