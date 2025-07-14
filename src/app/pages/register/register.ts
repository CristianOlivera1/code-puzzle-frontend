import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [Header, CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  names = '';
  surnames = '';
  username = '';
  email = '';
  password = '';
  showErrors = false;

  onRegister() {
    this.showErrors = true;
    if (!this.names || !this.surnames || !this.username || !this.email || !this.password) {
      return;
    }
    // Aquí iría la lógica de registro real
    alert('¡Registro exitoso!');
  }
}
