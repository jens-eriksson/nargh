import { EditUserModal } from '../modal/user/edit-user/edit-user';
import { UserProfileProvider } from './../providers/user-profile';
import { UserProfile } from './../model/user-profile';
import { AuthenticationProvider } from '../providers/authentication';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { SIDEBAR } from '../data/sidebar';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class LayoutPage implements OnInit {
  mobileView = false;
  userProfile: UserProfile;
  sidebar = SIDEBAR;
  activeUrl: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authProvider: AuthenticationProvider,
    private userProfileProvider: UserProfileProvider,
    private modalService: BsModalService
  ) {
    if (this.authProvider.isAuthenticated()) {
      this.userProfileProvider.get(this.authProvider.currentUser()).subscribe(userProfile => {
        this.userProfile = userProfile;
      });
    }
  }

  ngOnInit() {
    this.breakpointObserver
      .observe(['(min-width: 768px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.sidebar.hidden = false;
          this.mobileView = false;
        } else {
          this.sidebar.hidden = true;
          this.mobileView = true;
        }
      });
    this.activeUrl = this.router.url;
  }

  toggleSidebar() {
    this.sidebar.hidden = !this.sidebar.hidden;
  }

  navigate(url) {
    this.activeUrl = url;
    console.log(url);
    this.router.navigateByUrl(url);
    if (this.mobileView) {
      this.sidebar.hidden = true;
    }
  }

  signOut() {
    this.authProvider.signOut().then(() => {
      this.router.navigate(['sign-in']);
    });
  }

  openProfile() {
    this.modalService.show(EditUserModal, { initialState: { uid: this.userProfile.uid } });
  }
}
