import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-login',
  imports: [Header],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // Aquí puedes agregar lógica de autenticación y navegación
}
