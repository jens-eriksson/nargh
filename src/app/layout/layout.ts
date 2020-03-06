import { LayoutProvider } from './../providers/layout.provider';
import { ModalPageProvider } from './../providers/modal-page.provider';
import { EditUserModal } from '../modal/user/edit-user/edit-user';
import { UserProfileProvider } from './../providers/user-profile.provider';
import { UserProfile } from './../model/user-profile';
import { AuthenticationProvider } from '../providers/authentication.provider';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class LayoutPage implements OnInit {
  userProfile: UserProfile;
  activeUrl: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authProvider: AuthenticationProvider,
    private userProfileProvider: UserProfileProvider,
    private modalService: BsModalService,
    private modalPageProvider: ModalPageProvider,
    public layoutProvider: LayoutProvider
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
          this.layoutProvider.sidebar.hidden = false;
          this.layoutProvider.mobileView = false;
        } else {
          this.layoutProvider.sidebar.hidden = true;
          this.layoutProvider.mobileView = true;
        }
      });
    this.activeUrl = this.router.url;
  }

  toggleSidebar() {
    this.layoutProvider.sidebar.hidden = !this.layoutProvider.sidebar.hidden;
  }

  navigate(url) {
    this.activeUrl = url;
    this.router.navigateByUrl(url);
    if (this.layoutProvider.mobileView) {
      this.layoutProvider.sidebar.hidden = true;
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

  openModalPage(id) {
    this.modalPageProvider.open(id);
  }
}
