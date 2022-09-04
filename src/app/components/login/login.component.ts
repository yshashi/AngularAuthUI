import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  type: string = 'password';
  isText: boolean = false;
  eyeIcon:string = "fa-eye-slash"
  constructor(private fb : FormBuilder, private toast: NgToastService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username:['', Validators.required],
      password:['', Validators.required]
    })
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash'
    this.isText ? this.type = 'text' : this.type = 'password'
  }
  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.auth.signIn(this.loginForm.value)
      .subscribe({
        next:(res=>{
          console.log(res);
          this.loginForm.reset();
          this.router.navigate(['dashboard'])
          this.toast.success({detail:"Success",summary:'Login Success',duration:5000});
        }),
        error:(err=>{
          console.log(err)
          this.toast.error({detail:"ERROR",summary:err.error.message,duration:5000});
        })
      })
    } else {
      this.toast.error({detail:"ERROR",summary:'Please fill all details',duration:5000});
      ValidateForm.validateAllFormFields(this.loginForm); //{7}
    }
  }
}
