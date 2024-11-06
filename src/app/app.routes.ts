import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CreateComponent } from './components/create/create.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user/register', component: RegisterComponent, canActivate: [authGuard] },
    { path: 'user/login', component: LoginComponent, canActivate: [authGuard] },
    { path: 'profile/:id', component: UserProfileComponent },
    { path: 'create', component: CreateComponent }
];
