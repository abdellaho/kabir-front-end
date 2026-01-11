import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchatFactureComponent } from './achat-facture-component';

describe('AchatFactureComponent', () => {
  let component: AchatFactureComponent;
  let fixture: ComponentFixture<AchatFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchatFactureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchatFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
