import { UserProfile } from '../../model/user-profile';
import { UserProfileProvider } from '../../providers/user-profile';
import { AuthenticationProvider } from '../../providers/authentication';
import { Component, OnInit } from '@angular/core';
import {  BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.scss']
})
export class EditUserModal implements OnInit {
  uid: string;
  currentUser: UserProfile;
  userProfile: UserProfile;

  constructor(
    public bsModalRef: BsModalRef,
    private authProvider: AuthenticationProvider,
    private userProfileProvider: UserProfileProvider
    ) {
    if (this.authProvider.isAuthenticated()) {
      this.userProfileProvider.get(this.authProvider.currentUser()).subscribe(userProfile => {
        this.currentUser = userProfile;
      });
    }
  }

  ngOnInit() {
    if (this.uid) {
      this.userProfileProvider.get(this.uid).subscribe(userProfile => {
        this.userProfile = userProfile;
      });
    }
  }

  ok() {
    if (this.userProfile) {
      this.userProfileProvider.set(this.userProfile);
    }
    this.bsModalRef.hide();
  }

  cancel() {
    this.bsModalRef.hide();
  }
}
