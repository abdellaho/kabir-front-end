import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaisseGeneralComponent } from './caisse-general-component';

describe('CaisseGeneralComponent', () => {
  let component: CaisseGeneralComponent;
  let fixture: ComponentFixture<CaisseGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaisseGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaisseGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
