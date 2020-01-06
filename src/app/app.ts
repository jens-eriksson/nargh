import { Component } from '@angular/core';
import { AuthenticationProvider } from './providers/authentication';
import { environment } from './../environments/environment';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
}
