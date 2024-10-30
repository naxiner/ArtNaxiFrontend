import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreateComponent } from './create/create.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'user/register', component: RegisterComponent, canActivate: [authGuard] },
    { path: 'user/login', component: LoginComponent, canActivate: [authGuard] },
    { path: 'profile/:id', component: UserProfileComponent },
    { path: 'create', component: CreateComponent }
];
