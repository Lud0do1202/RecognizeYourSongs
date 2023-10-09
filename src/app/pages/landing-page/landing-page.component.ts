import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  /* *********************************************** */
  /* CONSTRUCTOR */
  constructor(private authService: AuthService) {}

  /* *********************************************** */
  /* INIT */
  ngOnInit(): void {
    // localStorage.clear();

    // Authorization to use the app
    this.authService.auth();
  }
}
