import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayTrackPageComponent } from './play-track-page.component';

describe('PlayTrackPageComponent', () => {
  let component: PlayTrackPageComponent;
  let fixture: ComponentFixture<PlayTrackPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlayTrackPageComponent]
    });
    fixture = TestBed.createComponent(PlayTrackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
