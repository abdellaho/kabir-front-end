import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepertoireFormComponent } from './repertoire-form-component';

describe('RepertoireFormComponent', () => {
  let component: RepertoireFormComponent;
  let fixture: ComponentFixture<RepertoireFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepertoireFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepertoireFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
