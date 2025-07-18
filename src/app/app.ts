import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { GoogleAuthService } from './core/services/oauth/google-auth.service';
import { TokenService } from './core/services/oauth/token.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'code-puzzle';

  constructor(
    private googleAuthService: GoogleAuthService,
    private tokenService: TokenService,
    private router: Router,@Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Procesar los tokens si están presentes en la URL
      const { idToken, accessToken } = this.googleAuthService.handleGoogleCallback();
      if (idToken && accessToken) {
        this.googleAuthService.registerWithGoogle(idToken, accessToken).subscribe(
          (response) => {
            if (response.type === 'success') {
              const jwtToken = response.data.jwtToken;
              this.tokenService.setToken(jwtToken);
              this.router.navigate(['/']);
            } else {
              console.error('Error al iniciar sesión:', response.listMessage[0]);
            }
          },
          (error) => {
            console.error('Error al procesar los tokens de Google:', error);
          }
        );

        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }

}
