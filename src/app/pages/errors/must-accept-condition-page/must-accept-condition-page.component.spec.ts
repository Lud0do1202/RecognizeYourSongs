import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MustAcceptConditionPageComponent } from './must-accept-condition-page.component';

describe('MustAcceptConditionPageComponent', () => {
  let component: MustAcceptConditionPageComponent;
  let fixture: ComponentFixture<MustAcceptConditionPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MustAcceptConditionPageComponent]
    });
    fixture = TestBed.createComponent(MustAcceptConditionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
