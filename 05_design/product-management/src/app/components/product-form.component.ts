import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product, ProductCreate, ProductUpdate } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b">
            <h1 class="text-3xl font-bold text-gray-900">
              {{ isEditMode ? 'Edit Product' : 'Create New Product' }}
            </h1>
          </div>
          
          <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="p-6">
            <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {{ error }}
            </div>

            <div class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  formControlName="name"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="productForm.get('name')?.invalid && productForm.get('name')?.touched"
                  placeholder="Enter product name">
                <div *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched" 
                     class="mt-1 text-sm text-red-600">
                  Product name is required
                </div>
              </div>

              <div>
                <label for="price" class="block text-sm font-medium text-gray-700">Price *</label>
                <div class="mt-1 relative">
                  <span class="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="price"
                    formControlName="price"
                    step="0.01"
                    min="0"
                    class="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="productForm.get('price')?.invalid && productForm.get('price')?.touched"
                    placeholder="0.00">
                </div>
                <div *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched" 
                     class="mt-1 text-sm text-red-600">
                  <span *ngIf="productForm.get('price')?.errors?.['required']">Price is required</span>
                  <span *ngIf="productForm.get('price')?.errors?.['min']">Price must be greater than 0</span>
                </div>
              </div>

              <div>
                <label for="stock" class="block text-sm font-medium text-gray-700">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  formControlName="stock"
                  min="0"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  [class.border-red-500]="productForm.get('stock')?.invalid && productForm.get('stock')?.touched"
                  placeholder="0">
                <div *ngIf="productForm.get('stock')?.invalid && productForm.get('stock')?.touched" 
                     class="mt-1 text-sm text-red-600">
                  <span *ngIf="productForm.get('stock')?.errors?.['required']">Stock quantity is required</span>
                  <span *ngIf="productForm.get('stock')?.errors?.['min']">Stock must be 0 or greater</span>
                </div>
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  formControlName="description"
                  rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product description (optional)"></textarea>
              </div>
            </div>

            <div class="mt-8 flex space-x-4">
              <button
                type="submit"
                [disabled]="productForm.invalid || loading"
                class="flex-1 bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                <span *ngIf="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                {{ loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product') }}
              </button>
              <button
                type="button"
                [routerLink]="['/products']"
                class="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
    productForm: FormGroup;
    isEditMode = false;
    productId: number | null = null;
    loading = false;
    error: string | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService
    ) {
        this.productForm = this.fb.group({
            name: ['', [Validators.required]],
            price: [0, [Validators.required, Validators.min(0.01)]],
            stock: [0, [Validators.required, Validators.min(0)]],
            description: ['']
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEditMode = true;
            this.productId = +id;
            this.loadProduct();
        }
    }

    loadProduct(): void {
        if (this.productId) {
            this.loading = true;
            this.productService.getProduct(this.productId).subscribe({
                next: (product) => {
                    this.productForm.patchValue({
                        name: product.name,
                        price: product.price,
                        stock: product.stock,
                        description: product.description || ''
                    });
                    this.loading = false;
                },
                error: (error) => {
                    this.error = error;
                    this.loading = false;
                }
            });
        }
    }

    onSubmit(): void {
        if (this.productForm.valid) {
            this.loading = true;
            this.error = null;

            const formData = this.productForm.value;
            const productData = {
                name: formData.name,
                price: formData.price,
                stock: formData.stock,
                description: formData.description || null
            };

            if (this.isEditMode && this.productId) {
                this.updateProduct(productData as ProductUpdate);
            } else {
                this.createProduct(productData as ProductCreate);
            }
        } else {
            this.markFormGroupTouched();
        }
    }

    private createProduct(product: ProductCreate): void {
        this.productService.createProduct(product).subscribe({
            next: (newProduct) => {
                this.router.navigate(['/products', newProduct.id]);
            },
            error: (error) => {
                this.error = error;
                this.loading = false;
            }
        });
    }

    private updateProduct(product: ProductUpdate): void {
        if (this.productId) {
            this.productService.updateProduct(this.productId, product).subscribe({
                next: (updatedProduct) => {
                    this.router.navigate(['/products', updatedProduct.id]);
                },
                error: (error) => {
                    this.error = error;
                    this.loading = false;
                }
            });
        }
    }

    private markFormGroupTouched(): void {
        Object.keys(this.productForm.controls).forEach(key => {
            const control = this.productForm.get(key);
            control?.markAsTouched();
        });
    }
}
