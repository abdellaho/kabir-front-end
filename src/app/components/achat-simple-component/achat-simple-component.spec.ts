import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchatSimpleComponent } from './achat-simple-component';

describe('AchatSimpleComponent', () => {
  let component: AchatSimpleComponent;
  let fixture: ComponentFixture<AchatSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchatSimpleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchatSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
