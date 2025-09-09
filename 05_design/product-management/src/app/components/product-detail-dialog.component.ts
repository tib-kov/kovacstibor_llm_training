import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';

@Component({
    selector: 'app-product-detail-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
    <!-- Dialog Backdrop -->
    <div *ngIf="isOpen && product" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="onBackdropClick($event)">
      <!-- Dialog Content -->
      <div class="bg-white rounded-lg shadow-lg mx-4" style="width: 444px; height: 286px;" (click)="$event.stopPropagation()">
        <!-- Dialog Header -->
        <div class="flex justify-between items-center px-6 pt-6 pb-4">
          <h2 class="text-base font-semibold text-black font-inter">Product Details</h2>
          <button 
            (click)="closeDialog()" 
            class="w-6 h-6 flex items-center justify-center bg-white rounded hover:bg-gray-50 transition-colors">
            <svg class="w-3 h-3" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Dialog Body -->
        <div class="px-6 pb-6">
          <!-- Product Name -->
          <div class="mb-4">
            <h3 class="text-base font-medium text-black font-inter">{{ product.name }}</h3>
          </div>

          <!-- Product Description -->
          <div class="mb-6">
            <p class="text-base text-gray-500 font-inter leading-6">{{ product.description }}</p>
          </div>

          <!-- Separator -->
          <div class="w-full h-px bg-black/10 mb-4"></div>

          <!-- Product Info Grid -->
          <div class="flex mb-6">
            <!-- Price Section -->
            <div>
              <div class="text-xs text-gray-500 font-inter mb-1">Price:</div>
              <div class="text-xs font-medium text-black font-inter">$ {{ product.price.toFixed(2) }}</div>
            </div>

            <!-- Stock Section -->
            <div class="ml-48">
              <div class="text-xs text-gray-500 font-inter mb-1">Stock:</div>
              <div class="text-xs text-black font-inter">{{ product.stock }} units</div>
            </div>
          </div>

          <!-- Product ID Section -->
          <div>
            <div class="text-xs text-gray-500 font-inter mb-1">Product ID:</div>
            <div class="text-xs text-black font-inter" style="font-size: 11px;">{{ product.id }}</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailDialogComponent {
    @Input() isOpen = false;
    @Input() product: Product | null = null;
    @Output() closeEvent = new EventEmitter<void>();

    closeDialog() {
        this.closeEvent.emit();
    }

    onBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            this.closeDialog();
        }
    }
}
