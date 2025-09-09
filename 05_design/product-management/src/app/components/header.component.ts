import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterModule],
    template: `
    <header class="bg-white shadow-lg">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-bold text-gray-900">
              <a [routerLink]="['/']" class="hover:text-blue-600">Product Manager</a>
            </h1>
          </div>
          <div class="flex space-x-4">
            <a [routerLink]="['/products']" 
               routerLinkActive="text-blue-600 font-semibold"
               class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              Products
            </a>
            <a [routerLink]="['/products/new']" 
               class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add Product
            </a>
          </div>
        </div>
      </nav>
    </header>
  `
})
export class HeaderComponent { }
