import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonSortieComponent } from './bon-sortie-component';

describe('BonSortieComponent', () => {
  let component: BonSortieComponent;
  let fixture: ComponentFixture<BonSortieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonSortieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonSortieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
