import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { animate, svg, stagger } from 'animejs';
import gsap from 'gsap';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero implements OnInit, OnDestroy, AfterViewInit {
  private intervals: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      animate(svg.createDrawable('.line'), {
        draw: ['0 0', '0 1', '1 1'],
        ease: 'inOutQuad',
        duration: 3800,
        delay: stagger(150),
        loop: true
      });
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initMagicStars();
            this.animateSVGLogo();
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
      star.style.opacity = '0';

      setTimeout(() => {
        const newPos = getRandomPosition();
        star.style.setProperty("--star-left", `${newPos.left}%`);
        star.style.setProperty("--star-top", `${newPos.top}%`);

        setTimeout(() => {
          star.style.opacity = '1';

        }, 300);
      }, 800);
    };

    const initialDelay = (index + 1) * 1000;
    const cycleInterval = 4000 + (index * 500);

    setTimeout(() => {
      cycleStar();
      const interval = setInterval(cycleStar, cycleInterval);
      this.intervals.push(interval);
    }, initialDelay);
  }

    private animateSVGLogo() {
    const svgElement = document.querySelector('.logo-svg');

    if (svgElement) {
      const tl = gsap.timeline();

      // Estado inicial: posición izquierda, fuera de pantalla
      gsap.set(svgElement, {
        x: -200,
        y: 0,
        rotation: -180,
        scale: 0.5,
        opacity: 0
      });

      // Animación de entrada
      tl.to(svgElement, {
        duration: 1.5,
        x: 0,
        y: 0,
        rotation: 360,
        scale: 1,
        opacity: 1,
        ease: "back.out(1.7)",
        delay: 0.5
      })
      // Pequeña animación de rebote final
      .to(svgElement, {
        duration: 0.3,
        scale: 1.1,
        ease: "power2.out"
      })
      .to(svgElement, {
        duration: 0.3,
        scale: 1,
        ease: "power2.out"
      })
      .to(svgElement, {
        duration: 4,
        rotation: "+=360",
        ease: "none",
        repeat: -1,
        yoyo: false
      });

      // Animación adicional de hover
      svgElement.addEventListener('mouseenter', () => {
        gsap.to(svgElement, {
          duration: 0.3,
          scale: 1.15,
          rotation: "+=180",
          ease: "power2.out"
        });
      });

      svgElement.addEventListener('mouseleave', () => {
        gsap.to(svgElement, {
          duration: 0.3,
          scale: 1,
          ease: "power2.out"
        });
      });
    }
  }
}
