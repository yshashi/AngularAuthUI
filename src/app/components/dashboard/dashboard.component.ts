import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserStoreService } from 'src/app/services/user-store.service';
import { forkJoin } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  fullName!: string;
  users!: User[];
  constructor(public userStore: UserStoreService, public auth: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.userStore.getFullName()
    .subscribe(res=>{
      let value = this.auth.getFullNameFromToken();
      this.fullName = res || value;
    })
    this.getUsers();
  }

  logOut(){
    this.auth.signOut();
  }

  loadFullName(){

  }

  getUsers(){
    this.userService.getAllUsers()
    .subscribe({
      next:(res=>{
        this.users = res
      })
    })
  }

}
