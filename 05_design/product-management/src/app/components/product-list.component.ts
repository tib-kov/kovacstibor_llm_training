import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, ProductCreate, ProductUpdate } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { ProductDialogComponent } from './product-dialog.component';
import { EditProductDialogComponent } from './edit-product-dialog.component';
import { ProductDetailDialogComponent } from './product-detail-dialog.component';
import { DeleteProductDialogComponent } from './delete-product-dialog.component';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ProductDialogComponent, EditProductDialogComponent, ProductDetailDialogComponent, DeleteProductDialogComponent],
    template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <h1 class="text-xl font-normal text-foreground mb-6">Product Management</h1>
      
      <!-- Search and Add Product Row -->
      <div class="flex justify-between items-center mb-6">
        <!-- Search Bar -->
        <div class="relative w-96">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
          <input 
            type="search" 
            [(ngModel)]="searchQuery"
            (input)="filterProducts()"
            placeholder="Search products..."
            class="w-full pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition-colors"
          />
        </div>
        
        <!-- Add Product Button -->
        <button 
          (click)="openAddProductDialog()"
          class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
          <span>Add Product</span>
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        <p class="mt-4 text-muted-foreground">Loading products...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
        {{ error }}
      </div>

      <!-- Products Grid -->
      <div *ngIf="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div *ngFor="let product of filteredProducts" 
             class="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow duration-200 w-full max-w-xs">
          
          <!-- Product Title -->
          <h4 class="text-sm font-normal text-foreground leading-none mb-4">{{ product.name }}</h4>
          
          <!-- Product Description -->
          <p class="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {{ product.description || 'No description available' }}
          </p>
          
          <!-- Price and Stock Row -->
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm font-medium text-primary">\${{ product.price }}</span>
            <span class="text-xs text-muted-foreground">Stock: {{ product.stock }}</span>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <!-- View Button -->
            <button 
              (click)="openProductDetailDialog(product)"
              class="inline-flex items-center gap-1 px-2 py-1.5 bg-card border border-border text-xs font-medium text-foreground rounded-md hover:bg-gray-50 transition-colors flex-1">
              <span>View</span>
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
            
            <!-- Edit Button -->
            <button 
              (click)="openEditProductDialog(product)"
              class="inline-flex items-center gap-1 px-2 py-1.5 bg-card border border-border text-xs font-medium text-foreground rounded-md hover:bg-gray-50 transition-colors flex-1">
              <span>Edit</span>
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            
            <!-- Delete Button -->
            <button 
              (click)="openDeleteProductDialog(product)"
              class="inline-flex items-center justify-center p-1.5 bg-destructive text-white rounded-md hover:bg-destructive/90 transition-colors min-w-[32px]">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="m19,6v14a2,2 0 01-2,2H7a2,2 0 01-2-2V6m3,0V4a2,2 0 012-2h4a2,2 0 012,2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !error && filteredProducts.length === 0" 
           class="text-center py-12">
        <div *ngIf="searchQuery && products.length > 0; else noProducts">
          <p class="text-muted-foreground text-lg mb-4">No products found matching "{{ searchQuery }}"</p>
          <button 
            (click)="clearSearch()"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            Clear Search
          </button>
        </div>
        <ng-template #noProducts>
          <p class="text-muted-foreground text-lg mb-4">No products found.</p>
          <button 
            (click)="openAddProductDialog()"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            Add Your First Product
          </button>
        </ng-template>
      </div>
    </div>

    <!-- Add Product Dialog -->
    <app-product-dialog 
      [isOpen]="isDialogOpen"
      (closeEvent)="closeAddProductDialog()"
      (productCreate)="createProduct($event)">
    </app-product-dialog>

    <!-- Edit Product Dialog -->
    <app-edit-product-dialog 
      [isOpen]="isEditDialogOpen"
      [product]="selectedProduct"
      (closeEvent)="closeEditProductDialog()"
      (productUpdate)="updateProduct($event)">
    </app-edit-product-dialog>

    <!-- Product Detail Dialog -->
    <app-product-detail-dialog 
      [isOpen]="isDetailDialogOpen"
      [product]="selectedProductForDetail"
      (closeEvent)="closeProductDetailDialog()">
    </app-product-detail-dialog>

    <!-- Delete Product Dialog -->
    <app-delete-product-dialog 
      [isOpen]="isDeleteDialogOpen"
      [product]="selectedProductForDelete"
      (closeEvent)="closeDeleteProductDialog()"
      (confirmDelete)="confirmDeleteProduct($event)">
    </app-delete-product-dialog>
  `
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    loading = true;
    error = '';
    searchQuery = '';
    isDialogOpen = false;
    isEditDialogOpen = false;
    isDetailDialogOpen = false;
    isDeleteDialogOpen = false;
    selectedProduct: Product | null = null;
    selectedProductForDetail: Product | null = null;
    selectedProductForDelete: Product | null = null;

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.loading = true;
        this.error = '';

        this.productService.getProducts().subscribe({
            next: (products) => {
                this.products = products;
                this.filteredProducts = [...products];
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Failed to load products. Please try again.';
                this.loading = false;
                console.error('Error loading products:', error);
            }
        });
    }

    filterProducts(): void {
        if (!this.searchQuery.trim()) {
            this.filteredProducts = [...this.products];
            return;
        }

        const query = this.searchQuery.toLowerCase();
        this.filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            (product.description && product.description.toLowerCase().includes(query))
        );
    }

    clearSearch(): void {
        this.searchQuery = '';
        this.filteredProducts = [...this.products];
    }

    openDeleteProductDialog(product: Product): void {
        this.selectedProductForDelete = product;
        this.isDeleteDialogOpen = true;
    }

    closeDeleteProductDialog(): void {
        this.isDeleteDialogOpen = false;
        this.selectedProductForDelete = null;
    }

    confirmDeleteProduct(product: Product): void {
        this.productService.deleteProduct(product.id).subscribe({
            next: () => {
                this.loadProducts(); // Reload the list
                this.closeDeleteProductDialog();
            },
            error: (error) => {
                this.error = 'Failed to delete product. Please try again.';
                console.error('Error deleting product:', error);
                this.closeDeleteProductDialog();
            }
        });
    }

    openAddProductDialog(): void {
        this.isDialogOpen = true;
    }

    closeAddProductDialog(): void {
        this.isDialogOpen = false;
    }

    createProduct(productData: ProductCreate): void {
        this.productService.createProduct(productData).subscribe({
            next: (newProduct) => {
                this.loadProducts(); // Reload the list to show the new product
                this.closeAddProductDialog();
            },
            error: (error) => {
                this.error = 'Failed to create product. Please try again.';
                console.error('Error creating product:', error);
            }
        });
    }

    openEditProductDialog(product: Product): void {
        this.selectedProduct = product;
        this.isEditDialogOpen = true;
    }

    closeEditProductDialog(): void {
        this.isEditDialogOpen = false;
        this.selectedProduct = null;
    }

    updateProduct(event: { id: number; data: ProductUpdate }): void {
        this.productService.updateProduct(event.id, event.data).subscribe({
            next: (updatedProduct) => {
                this.loadProducts(); // Reload the list to show the updated product
                this.closeEditProductDialog();
            },
            error: (error) => {
                this.error = 'Failed to update product. Please try again.';
                console.error('Error updating product:', error);
            }
        });
    }

    openProductDetailDialog(product: Product): void {
        this.selectedProductForDetail = product;
        this.isDetailDialogOpen = true;
    }

    closeProductDetailDialog(): void {
        this.isDetailDialogOpen = false;
        this.selectedProductForDetail = null;
    }
}
