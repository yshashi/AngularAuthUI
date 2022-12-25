import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private fullName$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  constructor() {
  }

  public getFullName():Observable<string>{
    return this.fullName$.asObservable();
  }

  public storeFullName(fullname:string){
    this.fullName$.next(fullname);
  }

  public getRole():Observable<string>{
    return this.role$.asObservable();
  }

  public storeRole(role:string){
    this.role$.next(role)
  }
}
