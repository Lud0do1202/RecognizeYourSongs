import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  /* *********************************************** */
  /* EMIT */
  @Output() onChange = new EventEmitter<string>();

  /* VAR */
  search!: string;

  /* *********************************************** */
  /* INIT */
  ngOnInit(): void {
    this.search = '';
  }
}
