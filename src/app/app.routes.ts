import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
    { path: 'user/register', component: RegisterComponent },
    { path: 'user/login', component: LoginComponent },
    { path: 'profile/:id', component: UserProfileComponent }
];
