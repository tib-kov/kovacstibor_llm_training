import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="container mx-auto px-4 py-8">
      <div *ngIf="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p class="mt-4 text-gray-600">Loading product...</p>
      </div>

      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
        <div class="mt-4">
          <button 
            [routerLink]="['/products']"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Back to Products
          </button>
        </div>
      </div>

      <div *ngIf="!loading && !error && product" class="max-w-2xl mx-auto">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b">
            <div class="flex justify-between items-center">
              <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
              <div class="flex space-x-2">
                <button 
                  [routerLink]="['/products', product.id, 'edit']"
                  class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                  Edit
                </button>
                <button 
                  (click)="deleteProduct()"
                  class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p class="text-gray-600">
                  {{ product.description || 'No description available' }}
                </p>
              </div>
              
              <div class="space-y-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Price</h3>
                  <p class="text-3xl font-bold text-green-600">\${{ product.price }}</p>
                </div>
                
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Stock</h3>
                  <span class="px-3 py-1 text-sm font-semibold rounded-full"
                        [class]="getStockClass(product.stock)">
                    {{ product.stock }} {{ product.stock === 1 ? 'item' : 'items' }} in stock
                  </span>
                </div>
                
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">Product ID</h3>
                  <p class="text-gray-600">#{{ product.id }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="px-6 py-4 bg-gray-50 border-t">
            <button 
              [routerLink]="['/products']"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              ← Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
    product: Product | null = null;
    loading = false;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadProduct(+id);
        } else {
            this.error = 'Invalid product ID';
        }
    }

    loadProduct(id: number): void {
        this.loading = true;
        this.error = null;

        this.productService.getProduct(id).subscribe({
            next: (product) => {
                this.product = product;
                this.loading = false;
            },
            error: (error) => {
                this.error = error;
                this.loading = false;
            }
        });
    }

    deleteProduct(): void {
        if (this.product && confirm(`Are you sure you want to delete "${this.product.name}"?`)) {
            this.productService.deleteProduct(this.product.id).subscribe({
                next: () => {
                    this.router.navigate(['/products']);
                },
                error: (error) => {
                    this.error = error;
                }
            });
        }
    }

    getStockClass(stock: number): string {
        if (stock === 0) {
            return 'bg-red-100 text-red-800';
        } else if (stock <= 10) {
            return 'bg-yellow-100 text-yellow-800';
        } else {
            return 'bg-green-100 text-green-800';
        }
    }
}
