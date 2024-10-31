import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreateComponent } from './create/create.component';
import { authGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user/register', component: RegisterComponent, canActivate: [authGuard] },
    { path: 'user/login', component: LoginComponent, canActivate: [authGuard] },
    { path: 'profile/:id', component: UserProfileComponent },
    { path: 'create', component: CreateComponent }
];
