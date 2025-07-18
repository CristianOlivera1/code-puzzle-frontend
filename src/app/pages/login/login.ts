import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GoogleAuthService } from '../../core/services/oauth/google-auth.service';
import { LoginService } from '../../core/services/oauth/login.service';
import { TokenService } from '../../core/services/oauth/token.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent{
  loginData: any = {
    email: '',
    contrasenha: ''
  };
  alert: { type: string; message: string } | null = null;
  isLoggingIn: boolean = false;
  showPassword: boolean = false;

  constructor(
    private loginService: LoginService,
    private tokenService: TokenService,
    private googleAuthService: GoogleAuthService,
    private router: Router, @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const { idToken, accessToken } = this.googleAuthService.handleGoogleCallback();
      if (idToken && accessToken) {
        this.loginWithGoogle(idToken, accessToken);
      }
    }
  }

  showAlert(type: string, message: string): void {
    this.alert = { type, message };
    setTimeout(() => {
      this.alert = null;
    }, 5000);
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (!this.loginData.email || !this.loginData.contrasenha) {
      this.showAlert('error', 'Todos los campos son obligatorios.');
      return;
    }
    this.isLoggingIn = true;

    this.loginService.login(this.loginData.email, this.loginData.contrasenha).subscribe(
      (response) => {
        if (response.type === 'success') {
          const jwtToken = response.data.jwtToken;
          this.tokenService.setToken(jwtToken);
          this.showAlert('success', response.listMessage[0]);
          this.router.navigate(['/']);
        } else {
          this.showAlert('error', 'Credenciales incorrectas.');
          this.isLoggingIn = false;

        }
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
        this.showAlert('error', 'Error al iniciar sesión. Inténtalo de nuevo.');
        this.isLoggingIn = false;

      }
    );
  }

  loginWithGoogle(idToken: string, accessToken: string): void {
    this.googleAuthService.registerWithGoogle(idToken, accessToken).subscribe(
      (response) => {
        if (response.type === 'success') {
          const jwtToken = response.data.jwtToken;
          this.tokenService.setToken(jwtToken);
          this.showAlert('success', response.listMessage[0]);
          this.router.navigate(['/']);
        } else {
          this.showAlert('error', response.listMessage[0]);
        }
      },
      (error) => {
        console.error('Error al iniciar sesión con Google:', error);
        this.showAlert('error', 'Error al iniciar sesión con Google.');
      }
    );
  }

  initiateGoogleLogin(): void {
    this.googleAuthService.loginWithGoogleOauth();
  }
}
