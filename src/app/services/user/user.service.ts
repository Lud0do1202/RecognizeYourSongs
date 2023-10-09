import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /* *********************************************** */
  /* CONSTRUCTOR */
  constructor(private authService: AuthService, private http: HttpClient) {}

  /* *********************************************** */
  /** Get the name and the img of the user */
  getUser(): Observable<User> {
    let headers = { Authorization: 'Bearer ' + this.authService.storage.getToken() };

    return this.http.get<any>('https://api.spotify.com/v1/me', { headers }).pipe(
      map((data: any) => {
        return {
          name: data.display_name,
          img: data.images[0].url,
        };
      })
    );
  }
}
