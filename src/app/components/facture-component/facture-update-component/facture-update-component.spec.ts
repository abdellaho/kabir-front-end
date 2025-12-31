import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureUpdateComponent } from './facture-update-component';

describe('FactureUpdateComponent', () => {
  let component: FactureUpdateComponent;
  let fixture: ComponentFixture<FactureUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
