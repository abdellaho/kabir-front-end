import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinPaiViewComponent } from './bulletin-pai-view-component';

describe('BulletinPaiViewComponent', () => {
  let component: BulletinPaiViewComponent;
  let fixture: ComponentFixture<BulletinPaiViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulletinPaiViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulletinPaiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
