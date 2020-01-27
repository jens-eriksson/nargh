import { UserProfile } from '../../../model/user-profile';
import { UserProfileProvider } from '../../../providers/user-profile';
import { AuthenticationProvider } from '../../../providers/authentication';
import { Component, OnInit } from '@angular/core';
import {  BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.html',
  styleUrls: ['./new-user.scss']
})
export class NewUserModal implements OnInit {
  uid: string;
  userProfile: UserProfile = {
    uid: '',
    displayName: '',
    email: '',
    phone: '',
    role: ''
  };
  password: string;

  constructor(
    public bsModalRef: BsModalRef,
    private authProvider: AuthenticationProvider,
    private userProfileProvider: UserProfileProvider
    ) {
  }

  ngOnInit() {
  }

  ok() {
    this.authProvider.registerUser(this.userProfile.email, this.password).then(uc => {
      this.userProfile.uid = uc.user.uid;
      this.userProfileProvider.set(this.userProfile);
    });
    this.bsModalRef.hide();
  }

  cancel() {
    this.bsModalRef.hide();
  }
}
