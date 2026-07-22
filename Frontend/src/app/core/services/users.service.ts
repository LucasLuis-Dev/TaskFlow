import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpService);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('users');
  }
}
