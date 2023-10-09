import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'recognize-your-songs';

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    // Button ripple
    this.primengConfig.ripple = true;
  }
}
