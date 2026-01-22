import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchatEtrangerComponent } from './achat-etranger-component';

describe('AchatEtrangerComponent', () => {
  let component: AchatEtrangerComponent;
  let fixture: ComponentFixture<AchatEtrangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchatEtrangerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchatEtrangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
