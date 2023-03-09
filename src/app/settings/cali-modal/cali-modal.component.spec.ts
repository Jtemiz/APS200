import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaliModalComponent } from './cali-modal.component';

describe('CaliModalComponent', () => {
  let component: CaliModalComponent;
  let fixture: ComponentFixture<CaliModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaliModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaliModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
