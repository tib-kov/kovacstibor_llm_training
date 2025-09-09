import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Product, ProductCreate, ProductUpdate } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatProgressSpinnerModule
    ],
    template: `
    <mat-toolbar>
      <button mat-icon-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span>{{ isEditMode ? 'Edit Product' : 'Create New Product' }}</span>
    </mat-toolbar>

    <div class="container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit Product' : 'Create New Product' }}</mat-card-title>
          <mat-card-subtitle>
            {{ isEditMode ? 'Update the product information below' : 'Fill in the details to create a new product' }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Product Name</mat-label>
              <input matInput 
                     formControlName="name" 
                     placeholder="Enter product name"
                     required>
              <mat-icon matSuffix>label</mat-icon>
              <mat-error *ngIf="productForm.get('name')?.hasError('required')">
                Product name is required
              </mat-error>
              <mat-error *ngIf="productForm.get('name')?.hasError('minlength')">
                Product name must be at least 2 characters long
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Price</mat-label>
              <input matInput 
                     type="number" 
                     formControlName="price" 
                     placeholder="0.00"
                     min="0"
                     step="0.01"
                     required>
              <span matPrefix>$</span>
              <mat-error *ngIf="productForm.get('price')?.hasError('required')">
                Price is required
              </mat-error>
              <mat-error *ngIf="productForm.get('price')?.hasError('min')">
                Price must be greater than 0
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Stock Quantity</mat-label>
              <input matInput 
                     type="number" 
                     formControlName="stock" 
                     placeholder="0"
                     min="0"
                     required>
              <mat-icon matSuffix>inventory</mat-icon>
              <mat-error *ngIf="productForm.get('stock')?.hasError('required')">
                Stock quantity is required
              </mat-error>
              <mat-error *ngIf="productForm.get('stock')?.hasError('min')">
                Stock quantity cannot be negative
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput 
                        formControlName="description" 
                        placeholder="Enter product description (optional)"
                        rows="4"
                        maxlength="500"></textarea>
              <mat-icon matSuffix>description</mat-icon>
              <mat-hint align="end">
                {{ productForm.get('description')?.value?.length || 0 }}/500
              </mat-hint>
            </mat-form-field>
          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button 
                  type="button" 
                  (click)="goBack()"
                  [disabled]="loading">
            Cancel
          </button>
          <button mat-raised-button 
                  color="primary" 
                  (click)="onSubmit()"
                  [disabled]="productForm.invalid || loading">
            <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
            <mat-icon *ngIf="!loading">{{ isEditMode ? 'update' : 'add' }}</mat-icon>
            {{ loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product') }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
    styles: [`
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    .form-card {
      margin-top: 20px;
    }

    .product-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 20px;
    }

    .full-width {
      width: 100%;
    }

    mat-card-title {
      margin-bottom: 8px;
    }

    mat-card-subtitle {
      color: #666;
      margin-bottom: 0;
    }

    mat-card-actions {
      margin-bottom: 0;
      padding-top: 16px;
      gap: 8px;
    }

    mat-card-actions button {
      margin-left: 8px;
    }

    mat-card-actions button:first-child {
      margin-left: 0;
    }

    .mat-mdc-raised-button mat-spinner {
      margin-right: 8px;
    }

    mat-form-field {
      margin-bottom: 8px;
    }

    textarea {
      resize: vertical;
      min-height: 80px;
    }
  `]
})
export class ProductFormComponent implements OnInit {
    productForm: FormGroup;
    isEditMode = false;
    productId: number | null = null;
    loading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private productService: ProductService,
        private snackBar: MatSnackBar
    ) {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            price: [0, [Validators.required, Validators.min(0.01)]],
            stock: [0, [Validators.required, Validators.min(0)]],
            description: ['']
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'create') {
            this.isEditMode = true;
            this.productId = Number(id);
            this.loadProduct(this.productId);
        }
    }

    loadProduct(id: number): void {
        this.loading = true;
        this.productService.getProduct(id).subscribe({
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
                this.loading = false;
                this.snackBar.open('Error loading product: ' + error.message, 'Close', {
                    duration: 5000
                });
                this.goBack();
            }
        });
    }

    onSubmit(): void {
        if (this.productForm.invalid) {
            this.markFormGroupTouched();
            return;
        }

        this.loading = true;
        const formValue = this.productForm.value;

        if (this.isEditMode && this.productId) {
            // Update existing product
            const updateData: ProductUpdate = {
                name: formValue.name,
                price: formValue.price,
                stock: formValue.stock,
                description: formValue.description || null
            };

            this.productService.updateProduct(this.productId, updateData).subscribe({
                next: (product) => {
                    this.loading = false;
                    this.snackBar.open('Product updated successfully', 'Close', {
                        duration: 3000
                    });
                    this.router.navigate(['/products', product.id]);
                },
                error: (error) => {
                    this.loading = false;
                    this.snackBar.open('Error updating product: ' + error.message, 'Close', {
                        duration: 5000
                    });
                }
            });
        } else {
            // Create new product
            const createData: ProductCreate = {
                name: formValue.name,
                price: formValue.price,
                stock: formValue.stock,
                description: formValue.description || undefined
            };

            this.productService.createProduct(createData).subscribe({
                next: (product) => {
                    this.loading = false;
                    this.snackBar.open('Product created successfully', 'Close', {
                        duration: 3000
                    });
                    this.router.navigate(['/products', product.id]);
                },
                error: (error) => {
                    this.loading = false;
                    this.snackBar.open('Error creating product: ' + error.message, 'Close', {
                        duration: 5000
                    });
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

    goBack(): void {
        if (this.isEditMode && this.productId) {
            this.router.navigate(['/products', this.productId]);
        } else {
            this.router.navigate(['/products']);
        }
    }
}
