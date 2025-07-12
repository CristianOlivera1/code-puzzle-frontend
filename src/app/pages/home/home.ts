import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';
import { Hero } from './components/hero/hero';
import { Languages } from './components/languages/languages';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-home',
  imports: [Header,Hero,Languages,Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
