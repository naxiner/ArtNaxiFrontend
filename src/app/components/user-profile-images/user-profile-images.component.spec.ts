import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileImagesComponent } from './user-profile-images.component';

describe('UserProfileImagesComponent', () => {
  let component: UserProfileImagesComponent;
  let fixture: ComponentFixture<UserProfileImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
