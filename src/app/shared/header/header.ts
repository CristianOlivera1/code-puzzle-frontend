import { UserService } from './../../core/services/user/user.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/oauth/token.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink,CommonModule,RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit  {
 isLoggedIn: boolean = false;
  userInfo: any = null;
  career: any[] = [];

  constructor(
    private tokenService: TokenService, private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isLoggedIn = !!this.tokenService.getToken();
      if (this.isLoggedIn) {
        this.loadUser();
      }

      window.addEventListener('storage', () => {
        this.isLoggedIn = !!this.tokenService.getToken();
        if (this.isLoggedIn) {
          this.loadUser();
        } else {
          this.userInfo = null;
        }
      });
    }
  }
  loadUser(): void {
    const userId = this.tokenService.getUserId();
    if (userId) {
      this.userService.getUserByUserId(userId).subscribe(
        (response) => {
          if (response.type === 'success') {
            this.userInfo = response.data;
            console.log("el usuario se obtenio", this.userInfo.nombre)
          } else {
            console.error('Error al obtener el perfil:', response.listMessage);
          }
        },
        (error) => {
          console.error('Error en la solicitud del perfil:', error);
        }
      );
    }
  }

  logOut(): void {
    this.tokenService.logOut();
    this.isLoggedIn = false;
    this.userInfo = null;
    this.router.navigate(['/']);
  }

  showPopover = false;
  @ViewChild('popoverMenu') popoverMenu!: ElementRef;
  togglePopover(): void {
    this.showPopover = !this.showPopover;
  }

  menuAbierto = false;
  @ViewChild('menuMovil') menuMovil!: ElementRef;
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

    @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (this.showPopover && this.popoverMenu && !this.popoverMenu.nativeElement.contains(target)) {
      this.showPopover = false;
    }

    if (this.menuAbierto && this.menuMovil && !this.menuMovil.nativeElement.contains(target)) {
      this.menuAbierto = false;
    }
  }
}
