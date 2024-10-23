import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path: 'user/register', component: RegisterComponent},
    {path: 'user/login', component: LoginComponent}
];
