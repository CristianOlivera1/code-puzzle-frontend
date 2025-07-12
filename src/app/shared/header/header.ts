import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-header',
  imports: [RouterLink,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  isLoggedIn: boolean = false;

    logOut(): void {

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
