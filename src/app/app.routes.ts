import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { StyleComponent } from './components/style/style.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CreateComponent } from './components/create/create.component';
import { guestGuard } from './guards/guest.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'admin/users', component: UserManagementComponent},
    { path: 'admin/styles', component: StyleComponent},
    { path: 'user/register', component: RegisterComponent, canActivate: [guestGuard] },
    { path: 'user/login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'profile/:id', component: UserProfileComponent },
    { path: 'create', component: CreateComponent, canActivate: [authGuard] },
    { path: '**', pathMatch: 'full', component: PageNotFoundComponent }
];
