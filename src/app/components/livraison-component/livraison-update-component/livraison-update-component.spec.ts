import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivraisonUpdateComponent } from './livraison-update-component';

describe('LivraisonUpdateComponent', () => {
  let component: LivraisonUpdateComponent;
  let fixture: ComponentFixture<LivraisonUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivraisonUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivraisonUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
