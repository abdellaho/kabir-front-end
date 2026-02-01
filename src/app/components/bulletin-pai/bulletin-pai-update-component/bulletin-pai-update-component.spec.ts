import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinPaiUpdateComponent } from './bulletin-pai-update-component';

describe('BulletinPaiUpdateComponent', () => {
  let component: BulletinPaiUpdateComponent;
  let fixture: ComponentFixture<BulletinPaiUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulletinPaiUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulletinPaiUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
