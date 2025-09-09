import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';

@Component({
    selector: 'app-delete-product-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
    <!-- Dialog Backdrop -->
    <div *ngIf="isOpen && product" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="onBackdropClick($event)">
      <!-- Dialog Content -->
      <div class="bg-white rounded-lg shadow-lg mx-4" style="width: 444px;" (click)="$event.stopPropagation()">
        <!-- Dialog Body -->
        <div class="px-6 py-6">
          <!-- Title -->
          <h2 class="text-base font-semibold text-black font-inter mb-4">Delete Product</h2>
          
          <!-- Confirmation Message -->
          <p class="text-xs text-gray-500 font-inter mb-6 leading-relaxed">
            Are you sure you want to delete "{{ product.name }}"? This action cannot be undone.
          </p>
          
          <!-- Action Buttons -->
          <div class="flex justify-end gap-4">
            <button 
              type="button"
              (click)="onCancel()"
              class="px-3 py-2 h-8 text-xs font-medium text-black bg-white border border-black/10 rounded-md hover:bg-gray-50 transition-colors font-inter whitespace-nowrap"
              style="width: 68px;">
              Cancel
            </button>
            <button 
              type="button"
              (click)="onConfirmDelete()"
              class="px-3 py-2 h-8 text-xs font-medium text-white rounded-md hover:opacity-90 transition-colors font-inter whitespace-nowrap"
              style="width: 109px; background-color: #D4183D;">
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DeleteProductDialogComponent {
    @Input() isOpen = false;
    @Input() product: Product | null = null;
    @Output() closeEvent = new EventEmitter<void>();
    @Output() confirmDelete = new EventEmitter<Product>();

    onCancel() {
        this.closeEvent.emit();
    }

    onConfirmDelete() {
        if (this.product) {
            this.confirmDelete.emit(this.product);
        }
    }

    onBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            this.closeEvent.emit();
        }
    }
}
