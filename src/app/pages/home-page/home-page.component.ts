import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers: [ConfirmationService],
})
export class HomePageComponent implements OnInit {
  /* *********************************************** */
  /* VAR */
  loader: boolean = true;
  user?: User;

  /* *********************************************** */
  /* CONSTRUCTOR */
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private confirmationService: ConfirmationService
  ) {}

  /* *********************************************** */
  /* INIT */
  ngOnInit(): void {
    // Already accept condition ?
    if (this.authService.storage.getRefreshToken()) this.refreshToken();
    else this.getToken();
  }

  /* *********************************************** */
  /** Refresh token */
  private refreshToken() {
    this.authService.refreshToken().subscribe({
      next: (data) => {
        this.initHomePage(data);
      },
      error: () => this.router.navigateByUrl('/error/unknown-error'),
    });
  }

  /* *********************************************** */
  /** Get a token */
  private getToken() {
    // First connection
    const urlParams = new URLSearchParams(window.location.search);

    // Error
    if (urlParams.get('error')) {
      this.router.navigateByUrl('/error/must-accept-conditions');
      return;
    }

    // Get the code
    let code = urlParams.get('code');

    // Get the code verifier
    let codeVerifier = this.authService.storage.getCodeVerifier();

    // Get the token
    this.authService.getToken(code!, codeVerifier!).subscribe({
      next: (data) => {
        this.initHomePage(data);
      },
      error: () => this.router.navigateByUrl('/error/unknown-error'),
    });
  }

  /* *********************************************** */
  /** The real init whether using token or refresh_token */
  private initHomePage(data: any) {
    // Save the token
    this.authService.storage.setToken(data.access_token);
    this.authService.storage.setRefreshToken(data.refresh_token);

    // Get the user data
    this.userService.getUser().subscribe({
      next: (user: User) => (this.user = user),
      error: () => this.router.navigateByUrl('/error/unknown-error'),
    });

    // Stop loader
    this.loader = false;
  }

  /* *********************************************** */
  /** Click on the user button */
  userClick(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to disconnect?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        localStorage.clear();
        this.router.navigateByUrl('/');
        return;
      },
    });
  }
}
