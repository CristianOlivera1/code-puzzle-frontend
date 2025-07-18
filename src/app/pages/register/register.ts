import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GoogleAuthService } from '../../core/services/oauth/google-auth.service';
import { RegisterService } from '../../core/services/oauth/register.service';
import { TokenService } from '../../core/services/oauth/token.service';
import { CustomValidators } from '../../Validators/CustomValidators';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule,RouterLink,CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {
registerData: any = {
    nombre: '',
    email: '',
    contrasenha: '',
    confirmarContrasenha: '',
  };

  alert: { type: string; message: string } | null = null;
  isRegistering: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private registerService: RegisterService, private router: Router,private tokenService:TokenService,private customValidators: CustomValidators,@Inject(PLATFORM_ID) private platformId: Object,private googleAuthService:GoogleAuthService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const { idToken, accessToken } = this.googleAuthService.handleGoogleCallback();
      if (idToken && accessToken) {
        this.registerWithGoogle(idToken, accessToken);
      }
    }
  }

  showAlert(type: string, message: string): void {
    this.alert = { type, message };
    setTimeout(() => {
      this.alert = null;
    }, 5000);
  }

  register(): void {

  // Validaciones
  const errors: string[] = [];

  const emailError = this.customValidators.validateEmail(this.registerData.email);
  if (emailError) {
    this.showAlert('warning', emailError);
    return;
  }

  const passwordError = this.customValidators.validatePassword(
    this.registerData.contrasenha,
    this.registerData.confirmarContrasenha
  );
  if (passwordError) {
    this.showAlert('warning', passwordError);
    return;
  }

  if (!this.registerData.nombre || !this.registerData.email || !this.registerData.contrasenha|| !this.registerData.confirmarContrasenha) {
    this.showAlert('warning', 'Todos los campos son obligatorios.');
    return;
  }

  this.isRegistering = true;

    const formData = new FormData();
    formData.append('nombre', this.registerData.nombre);
    formData.append('email', this.registerData.email);
    formData.append('contrasenha', this.registerData.contrasenha);
    this.registerService.registerUser(formData).subscribe(
      (response) => {
        if (response.type === 'success') {
               const jwtToken = response.data.jwtToken;
          this.tokenService.setToken(jwtToken);
          this.showAlert('success', response.listMessage);
            this.router.navigate(['/']);
        } else {
          this.showAlert('error', response.listMessage);
          this.isRegistering = false;

        }
      },
      (error) => {
        console.error('Error al registrar:', error);
        this.showAlert('error', 'Error al registrar el usuario.');
        this.isRegistering = false;
      }
    );
  }

  registerWithGoogle(idToken: string, accessToken: string): void {
    this.googleAuthService.registerWithGoogle(idToken, accessToken).subscribe(
      (response: any) => {
        if (response.type === 'success') {
          const jwtToken = response.data.jwtToken;
          this.tokenService.setToken(jwtToken);
          this.showAlert('success', response.listMessage);
          window.location.href = '/';

        } else {
          this.showAlert('error', response.listMessage);
        }
      },
      (error) => {
        console.error('Error al registrar con Google:', error);
        this.showAlert('error', 'Error al registrar con Google.');
      }
    );
  }

  loginWithGoogle(): void {
    this.googleAuthService.registerWithGoogleOauth();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
