import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor() {}

  error(e: HttpErrorResponse) : void {

    // 401 --> Session expire
    if(e.status === 401) {

    }
  }
}
