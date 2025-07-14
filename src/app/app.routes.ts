import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [
  {path:'', component: Home},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},


];
