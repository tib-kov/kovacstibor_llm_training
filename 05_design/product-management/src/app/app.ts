import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header.component';
import { CartComponent } from './components/cart.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CartComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('product-management');
}
