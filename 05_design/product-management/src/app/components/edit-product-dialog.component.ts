import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, ProductUpdate } from '../models/product.model';

@Component({
    selector: 'app-edit-product-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    template: `
    <!-- Dialog Backdrop -->
    <div *ngIf="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="onBackdropClick($event)">
      <!-- Dialog Content -->
      <div class="bg-white rounded-lg shadow-lg w-96 max-w-md mx-4" (click)="$event.stopPropagation()">
        <!-- Dialog Header -->
        <div class="flex justify-between items-center p-6 pb-4">
                  <!-- Header -->
        <h2 class="text-base font-semibold text-black font-['Inter']">Edit product</h2>
          <button 
            (click)="closeDialog()" 
            class="w-6 h-6 flex items-center justify-center bg-white rounded hover:bg-gray-50 transition-colors">
            <svg class="w-3 h-3" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Dialog Body -->
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="px-6">
                    <!-- Product Name -->
          <div>
            <label class="block text-xs font-medium text-black mb-2 font-['Inter']">Product name</label>
            <input 
              type="text" 
              formControlName="name"
              placeholder="Enter product name"
              class="w-full px-3 py-2 text-xs bg-gray-100 text-gray-600 placeholder-gray-400 border-0 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary transition-colors font-['Inter']">
          </div>

          <!-- Product Description -->
          <div>
            <label class="block text-xs font-medium text-black mb-2 font-['Inter']">Product description</label>
            <textarea 
              formControlName="description"
              placeholder="Enter product description"
              rows="3"
              class="w-full px-3 py-2 text-xs bg-gray-100 text-gray-600 placeholder-gray-400 border-0 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary transition-colors resize-none font-['Inter']">
            </textarea>
          </div>

          <!-- Price and Stock Row -->
          <div class="flex gap-4 mb-6">
            <!-- Price -->
            <div class="flex-1">
              <label class="block text-xs font-medium text-black mb-2 font-['Inter']">Price ($)</label>
              <input 
                type="number" 
                formControlName="price"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 text-xs bg-gray-100 text-black border-0 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary transition-colors font-['Inter']">
            </div>

            <!-- Stock -->
            <div class="flex-1">
              <label class="block text-xs font-medium text-black mb-2 font-['Inter']">Stock</label>
              <input 
                type="number" 
                formControlName="stock"
                min="0"
                class="w-full px-3 py-2 text-xs bg-gray-100 text-black border-0 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary transition-colors font-['Inter']">
            </div>
          </div>

          <!-- Dialog Footer -->
          <div class="flex justify-end gap-3 pb-6">
            <button 
              type="button"
              (click)="closeDialog()"
              class="px-4 py-2 text-xs font-medium text-black bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-['Inter']">
              Cancel
            </button>
            <button 
              type="submit"
              [disabled]="productForm.invalid || isSubmitting"
              class="px-4 py-2 text-xs font-medium text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-['Inter']">
              {{ isSubmitting ? 'Updating...' : 'Update Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EditProductDialogComponent implements OnChanges {
    @Input() isOpen = false;
    @Input() product: Product | null = null;
    @Output() closeEvent = new EventEmitter<void>();
    @Output() productUpdate = new EventEmitter<{ id: number; data: ProductUpdate }>();

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

    ngOnChanges(changes: SimpleChanges) {
        if (changes['product'] && this.product) {
            this.populateForm();
        }
    }

    populateForm() {
        if (this.product) {
            this.productForm.patchValue({
                name: this.product.name,
                description: this.product.description || '',
                price: this.product.price,
                stock: this.product.stock
            });
        }
    }

    closeDialog() {
        this.productForm.reset();
        this.isSubmitting = false;
        this.closeEvent.emit();
    }

    onBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            this.closeDialog();
        }
    }

    onSubmit() {
        if (this.productForm.valid && !this.isSubmitting && this.product) {
            this.isSubmitting = true;
            const updateData: ProductUpdate = {
                name: this.productForm.value.name,
                description: this.productForm.value.description || '',
                price: parseFloat(this.productForm.value.price),
                stock: parseInt(this.productForm.value.stock)
            };

            this.productUpdate.emit({ id: this.product.id, data: updateData });
        }
    }

    resetSubmitting() {
        this.isSubmitting = false;
    }
}
