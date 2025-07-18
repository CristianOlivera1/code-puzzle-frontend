import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero implements OnInit, OnDestroy, AfterViewInit {
  private intervals: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {}

  ngAfterViewInit() {

    // Solo ejecutar en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.initMagicStars();
    }
  }

  ngOnDestroy() {
    this.intervals.forEach(interval => clearInterval(interval));
  }

  private initMagicStars() {
    const magicStarElements = document.getElementsByClassName("magic-star") as HTMLCollectionOf<HTMLElement>;

    Array.from(magicStarElements).forEach((star, index) => {
      // Cada estrella tiene su propio ciclo independiente
      this.animateStar(star, index);
    });
  }

  private animateStar(star: HTMLElement, index: number) {
    const getRandomPosition = () => {
      const positions = [
        { left: Math.random() * 20 - 10, top: Math.random() * 30 - 40 },
        { left: Math.random() * 20 + 90, top: Math.random() * 30 - 40 },
        { left: Math.random() * 20 - 10, top: Math.random() * 30 + 10 },
        { left: Math.random() * 20 + 90, top: Math.random() * 30 + 10 },
        { left: Math.random() * 60 + 20, top: Math.random() * 20 - 30 },
      ];
      return positions[Math.floor(Math.random() * positions.length)];
    };

    const cycleStar = () => {
      // Fase 1: Apagar la estrella - solo opacidad
      star.style.opacity = '0';

      setTimeout(() => {
        // Fase 2: Cambiar posición mientras está apagada
        const newPos = getRandomPosition();
        star.style.setProperty("--star-left", `${newPos.left}%`);
        star.style.setProperty("--star-top", `${newPos.top}%`);

        setTimeout(() => {
          // Fase 3: Encender la estrella en nueva posición
          star.style.opacity = '1';

        }, 300); // Tiempo para cambiar posición
      }, 800); // Tiempo apagada
    };

    // Iniciar cada estrella con delay diferente
    const initialDelay = (index + 1) * 1000;
    const cycleInterval = 4000 + (index * 500);

    setTimeout(() => {
      cycleStar();
      const interval = setInterval(cycleStar, cycleInterval);
      this.intervals.push(interval);
    }, initialDelay);
  }
}
