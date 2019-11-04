import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User;
  constructor(private userService: UserService,private _router: Router) { }

  ngOnInit() {
    this.user = new User();
  }
  login() {
    this.userService.login(this.user).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('uid', res.userId);
        this._router.navigate(['/todos']);
      });
  }
}
