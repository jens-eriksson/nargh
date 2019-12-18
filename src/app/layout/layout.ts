import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { SIDEBAR } from '../data/sidebar';
import { LOGGEDIN_USER } from '../data/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class LayoutPage implements OnInit {
  mobileView = false;
  loggedInUser = LOGGEDIN_USER;
  sidebar = SIDEBAR;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
  }

  ngOnInit() {
    console.log('ngOnInit');
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
  }

  toggleSidebar() {
    this.sidebar.hidden = !this.sidebar.hidden;
  }

  navigate(index) {
    this.sidebar.activeMenuItem = index;
    if (this.mobileView) {
      this.sidebar.hidden = true;
    }
  }
}
