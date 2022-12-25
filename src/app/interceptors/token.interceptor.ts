import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { ITokenModel } from '../models/token.interface';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    let authreq = request;
    authreq = this.setTokenheader(request, this.auth.getToken()!);
    return next.handle(authreq).pipe(
      catchError((errordata) => {
        if (errordata.status === 401) {
          return this.handleUnauthorizedError(request, next);
        }
        return throwError(() => errordata);
      })
    );
  }

  handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler) {
    const accessToken = this.auth.getToken()!;
    const refreshToken = this.auth.getRefreshToken()!;
    return this.auth
      .renewToken(accessToken, refreshToken)
      .pipe(
        switchMap((data: ITokenModel) => {
          this.auth.storeRefreshToken(data.refreshToken);
          this.auth.storeToken(data.accessToken);
          return next.handle(this.setTokenheader(request, data.accessToken));
        }),
        catchError((err) => {
          return throwError(() => {
            this.toast.error({detail:'ERROR', summary:'Token Expired', duration:5000});
            this.router.navigate(['/'])
          });
        })
      );
  }

  setTokenheader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {Authorization:`Bearer ${token}`}
    });
  }
}
