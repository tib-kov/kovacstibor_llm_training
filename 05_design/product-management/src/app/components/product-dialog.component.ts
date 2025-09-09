import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductCreate } from '../models/product.model';

@Component({
    selector: 'app-product-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    template: `
    <!-- Dialog Backdrop -->
    <div *ngIf="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="onBackdropClick($event)">
      <!-- Dialog Content -->
      <div class="bg-white rounded-lg shadow-lg mx-4" style="width: 388px;" (click)="$event.stopPropagation()">
        <!-- Dialog Header -->
        <div class="flex justify-between items-center px-6 pt-6 pb-4">
          <h2 class="text-base font-semibold text-black font-inter">Add New Product</h2>
          <button 
            (click)="closeDialog()" 
            class="w-6 h-6 flex items-center justify-center bg-white rounded hover:bg-gray-50 transition-colors">
            <svg class="w-3 h-3" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Dialog Body -->
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="px-6 pb-6">
          <!-- Product Name -->
          <div class="mb-6">
            <label class="block text-xs font-medium text-black mb-2 font-inter">Product Name</label>
            <input 
              type="text" 
              formControlName="name"
              placeholder="Enter product name"
              class="w-full px-3 py-2 h-8 text-xs bg-gray-100 text-gray-600 placeholder-gray-400 border-0 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary transition-colors font-inter">
          </div>

          <!-- Description -->
          <div class="mb-6">
            <label class="block text-xs font-medium text-black mb-2 font-inter">Description</label>
            <textarea 
              formControlName="description"
              rows="3"
              placeholder="Enter product description"
              class="w-full px-3 py-2 text-xs bg-gray-100 text-gray-600 placeholder-gray-400 border-0 rounded-md resize-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary transition-colors font-inter"
              style="height: 56px;"></textarea>
          </div>

          <!-- Price and Stock Row -->
          <div class="flex gap-4 mb-6">
            <!-- Price -->
            <div class="flex-1">
              <label class="block text-xs font-medium text-black mb-2 font-inter">Price ($)</label>
              <input 
                type="number" 
                formControlName="price"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full px-3 py-2 h-8 text-xs bg-gray-100 text-gray-600 placeholder-gray-400 border-0 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary transition-colors font-inter">
            </div>

            <!-- Stock -->
            <div class="flex-1">
              <label class="block text-xs font-medium text-black mb-2 font-inter">Stock</label>
              <input 
                type="number" 
                formControlName="stock"
                min="0"
                placeholder="0"
                class="w-full px-3 py-2 h-8 text-xs bg-gray-100 text-gray-600 placeholder-gray-400 border-0 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary transition-colors font-inter">
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-8">
            <button 
              type="button"
              (click)="closeDialog()"
              class="px-3 py-2 h-8 text-xs font-medium text-black bg-white border border-black/10 rounded-md hover:bg-gray-50 transition-colors font-inter whitespace-nowrap"
              style="width: 68px;">
              Cancel
            </button>
            <button 
              type="submit"
              [disabled]="productForm.invalid"
              class="px-3 py-2 h-8 text-xs font-medium text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-inter whitespace-nowrap"
              style="width: auto; min-width: 95px;">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProductDialogComponent {
    @Input() isOpen = false;
    @Output() closeEvent = new EventEmitter<void>();
    @Output() productCreate = new EventEmitter<ProductCreate>();

    productForm: FormGroup;
    isSubmitting = false;

    constructor(private fb: FormBuilder) {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(1)]],
            description: [''],
            price: [0, [Validators.required, Validators.min(0)]],
            stock: [0, [Validators.required, Validators.min(0)]]
        });
    }

    closeDialog() {
        this.productForm.reset();
        this.closeEvent.emit();
    }

    onBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            this.closeDialog();
        }
    }

    onSubmit() {
        if (this.productForm.valid && !this.isSubmitting) {
            this.isSubmitting = true;
            const productData: ProductCreate = {
                name: this.productForm.value.name,
                description: this.productForm.value.description || '',
                price: parseFloat(this.productForm.value.price),
                stock: parseInt(this.productForm.value.stock)
            };

            this.productCreate.emit(productData);
        }
    }

    resetSubmitting() {
        this.isSubmitting = false;
    }
}
