import { EditUserModal } from './../../modal/edit-user/edit-user';
import { NewUserModal } from './../../modal/new-user/new-user';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserProfile } from './../../model/user-profile';
import { UserProfileProvider } from './../../providers/user-profile';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class UsersPage implements OnInit {
  userProfiles: UserProfile[];

  constructor(
    private userProfileProvider: UserProfileProvider,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.userProfileProvider.all().subscribe(users => {
      this.userProfiles = users;
    });
  }

  add() {
    this.modalService.show(NewUserModal);
  }

  edit(uid) {
    this.modalService.show(EditUserModal, { initialState: { uid } });
  }
}
