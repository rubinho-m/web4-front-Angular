import {AfterViewInit, Component} from '@angular/core';
import * as CryptoJS from 'crypto-js'
import {Point} from "../point";
import {User} from "../user";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {AuthorizationService} from "../service/authorization.service";


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements AfterViewInit {
  regUser: User = new User()
  authUser: User = new User()

  regLogins = document.getElementsByClassName('reg-login')
  regPasswords = document.getElementsByClassName('reg-password')
  authLogins = document.getElementsByClassName('auth-login')
  authPasswords = document.getElementsByClassName('auth-password')

  constructor(private authorizationService: AuthorizationService, private router: Router) {
  }

  ngAfterViewInit() {

    for (const regLogin of Array.from(this.regLogins)) {
      regLogin.addEventListener('input', (event: MouseEvent) => {
        this.setRegLogin(event)
      });
    }

    for (const regPassword of Array.from(this.regPasswords)) {
      regPassword.addEventListener('input', (event: MouseEvent) => {
        this.setRegPassword(event)
      });
    }

    for (const authLogin of Array.from(this.authLogins)) {
      authLogin.addEventListener('input', (event: MouseEvent) => {
        this.setAuthLogin(event)
      });
    }

    for (const authPassword of Array.from(this.authPasswords)) {
      authPassword.addEventListener('input', (event: MouseEvent) => {
        this.setAuthPassword(event)
      });
    }


  }

  setRegLogin(event): void {
    this.regUser.login = event.target.value
  }

  setRegPassword(event): void {
    this.regUser.hashPassword = CryptoJS.SHA256(event.target.value).toString()
  }

  setAuthLogin(event): void {
    this.authUser.login = event.target.value
  }

  setAuthPassword(event): void {
    this.authUser.hashPassword = CryptoJS.SHA256(event.target.value).toString()
  }


  register(): void {
    if (this.regUser.login && this.regUser.hashPassword) {
      this.authorizationService.register(this.regUser).subscribe(
        (response) => {
          localStorage.setItem("username", this.regUser.login);
          localStorage.setItem("token", "token");
          this.router.navigate(['/points']);
        },
        (error) => {

        }
      )
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Заполните все поля",
        showConfirmButton: false,
        timer: 1500
      });
    }
    console.log("REGISTER")

  }

  login(): void {
    if (this.authUser.login && this.authUser.hashPassword) {
      this.authorizationService.authorize(this.authUser).subscribe(
        (response) => {
          localStorage.setItem("username", this.authUser.login);
          localStorage.setItem("token", "token");
          this.router.navigate(['/points']);
        },
        (error) => {

        }
      )
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Заполните все поля",
        showConfirmButton: false,
        timer: 1500
      });
    }


    console.log("LOGIN")

  }
}
