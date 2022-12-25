import { UserStoreService } from 'src/app/services/user-store.service';
import { ILogin } from './../models/ILogin';
import { IApiResponse } from './../models/api-response.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7066/api/User/';
  private userPayload: any;
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.userPayload = this.decodedToken();
  }

  signUp(userObj: User) {
    return this.http.post<IApiResponse>(`${this.baseUrl}register`, userObj);
  }

  signIn(loginObj: ILogin) {
    return this.http.post<User>(`${this.baseUrl}authenticate`, loginObj);
  }

  signOut() {
    this.router.navigate(['/']);
    localStorage.clear();
  }

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }
  storeRefreshToken(refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  decodedToken() {
    const helper = new JwtHelperService();
    return helper.decodeToken(this.getToken()!);
  }

  getFullNameFromToken() {
    if (this.userPayload) return this.userPayload.name;
  }

  getRoleFromToken() {
    if (this.userPayload) return this.userPayload.role;
  }

  renewToken(accessoken:string, refreshToken:string){
    let tokenApi;
    if(accessoken === null || refreshToken === null)
    tokenApi = null;
    tokenApi= {
      accessToken:accessoken,
      refreshToken:refreshToken
    }
    return this.http.post<any>(`${this.baseUrl}refresh`,tokenApi)
  }
}
