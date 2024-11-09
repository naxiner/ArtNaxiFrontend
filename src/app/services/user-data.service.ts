import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private usernameSubject = new BehaviorSubject<string>('');
  private emailSubject = new BehaviorSubject<string>('');
  private avatarUrlSubject = new BehaviorSubject<string>('');

  username$ = this.usernameSubject.asObservable();
  email$ = this.emailSubject.asObservable();
  avatarUrl$ = this.avatarUrlSubject.asObservable();

  setUsername(username: string) {
    this.usernameSubject.next(username);
  }

  setEmail(email: string) {
    this.emailSubject.next(email);
  }

  setAvatarUrl(avatarUrl: string) {
    this.avatarUrlSubject.next(avatarUrl);
  }
}
