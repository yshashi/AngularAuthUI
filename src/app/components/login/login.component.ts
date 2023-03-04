import { UserStoreService } from './../../services/user-store.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  resetPasswordEmail!: string;
  constructor(
    private fb: FormBuilder,
    private toast: NgToastService,
    private auth: AuthService,
    private router: Router,
    private userStore: UserStoreService,
    private resetPasswordService: ResetPasswordService,
    private authService: SocialAuthService
  ) { }
  user!: SocialUser;
  loggedIn!: boolean;
  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    localStorage.removeItem('token');

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if(this.loggedIn){

        this.auth.signUp({username:user.email,password:'Admin@123',email:user.email,firstName:user.firstName,lastName:user.lastName || 'Yadav'})
        .subscribe(res=>{

          this.auth.signIn({username:user.email, password:'Admin@123',})
          .subscribe(res=>{
            this.router.navigate(['dashboard']);
            this.toast.success({
              detail: 'Success',
              summary: 'Login Success',
              duration: 5000,
            });
            this.auth.storeToken(res.accessToken!);
            this.auth.storeRefreshToken(res.refreshToken!);
            let decodedValue = this.auth.decodedToken();
            this.userStore.storeFullName(decodedValue.name);
            this.userStore.storeRole(decodedValue.role);
          })
        })
        //this.auth.storeToken(user.idToken);
      }
      console.log(this.user, "user")
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }
  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.auth.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.loginForm.reset();
          this.router.navigate(['dashboard']);
          this.toast.success({
            detail: 'Success',
            summary: 'Login Success',
            duration: 5000,
          });
          this.auth.storeToken(res.accessToken!);
          this.auth.storeRefreshToken(res.refreshToken!);
          let decodedValue = this.auth.decodedToken();
          this.userStore.storeFullName(decodedValue.name);
          this.userStore.storeRole(decodedValue.role);

        }
      });
    } else {
      this.toast.error({
        detail: 'ERROR',
        summary: 'Please fill all details',
        duration: 5000,
      });
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }

  public isValidEmail!: boolean;
  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToReset() {
    if (this.checkValidEmail(this.resetPasswordEmail)) {
      this.resetPasswordService.sendResetPasswordLink(this.resetPasswordEmail)
        .subscribe({
          next: (res) => {
            const buttonRef = document.getElementById("closeBtn");
            buttonRef?.click();
          },
          error: (err) => {
            this.toast.error({
              detail: 'ERROR',
              summary: 'Something went wrong!',
              duration: 5000,
            });
          }
        })
    }
  }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => this.router.navigate(['dashboard']));;
  }
}
