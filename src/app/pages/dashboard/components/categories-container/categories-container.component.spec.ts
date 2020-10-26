import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesContainerComponent } from './categories-container.component';

describe('CategoriesContainerComponent', () => {
  let component: CategoriesContainerComponent;
  let fixture: ComponentFixture<CategoriesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriesContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
