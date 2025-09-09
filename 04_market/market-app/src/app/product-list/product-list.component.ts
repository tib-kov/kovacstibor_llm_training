import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatDialogModule
    ],
    template: `
    <mat-toolbar color="primary">
      <span>Product Management</span>
      <span class="spacer"></span>
      <button mat-raised-button color="accent" (click)="createProduct()">
        <mat-icon>add</mat-icon>
        Add Product
      </button>
    </mat-toolbar>

    <div class="container">
      <div class="product-grid" *ngIf="products.length > 0; else noProducts">
        <mat-card *ngFor="let product of products" class="product-card">
          <mat-card-header>
            <mat-card-title>{{ product.name }}</mat-card-title>
            <mat-card-subtitle>\${{ product.price | number:'1.2-2' }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p class="description">{{ product.description || 'No description available' }}</p>
            <p class="stock">
              <strong>Stock:</strong> 
              <span [class]="product.stock <= 5 ? 'low-stock' : 'good-stock'">
                {{ product.stock }}
              </span>
            </p>
          </mat-card-content>
          
          <mat-card-actions align="end">
            <button mat-button color="primary" (click)="viewProduct(product.id)">
              <mat-icon>visibility</mat-icon>
              View
            </button>
            <button mat-button color="accent" (click)="editProduct(product.id)">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
            <button mat-button color="warn" (click)="deleteProduct(product)">
              <mat-icon>delete</mat-icon>
              Delete
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <ng-template #noProducts>
        <div class="no-products">
          <mat-icon class="large-icon">inventory_2</mat-icon>
          <h2>No products found</h2>
          <p>Start by adding your first product!</p>
          <button mat-raised-button color="primary" (click)="createProduct()">
            <mat-icon>add</mat-icon>
            Add Product
          </button>
        </div>
      </ng-template>
    </div>
  `,
    styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .product-card {
      transition: transform 0.2s ease-in-out;
    }

    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.12);
    }

    .description {
      margin: 10px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.4;
    }

    .stock {
      margin: 5px 0;
      font-size: 14px;
    }

    .low-stock {
      color: #f44336;
      font-weight: bold;
    }

    .good-stock {
      color: #4caf50;
      font-weight: bold;
    }

    .no-products {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .large-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #ccc;
      margin-bottom: 20px;
    }

    mat-card-actions {
      margin-bottom: 0;
    }

    mat-card-title {
      font-size: 18px;
      font-weight: 500;
    }

    mat-card-subtitle {
      font-size: 16px;
      font-weight: bold;
      color: #4caf50;
    }
  `]
})
export class ProductListComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    private navigationSubscription: Subscription | undefined;

    constructor(
        private productService: ProductService,
        private router: Router,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {
        // Subscribe to router events to refresh data when navigating back to this page
        this.navigationSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                if (event.url === '/products' || event.url === '/') {
                    this.loadProducts();
                }
            });
    }

    ngOnInit(): void {
        this.loadProducts();
    }

    ngOnDestroy(): void {
        // Clean up the subscription to prevent memory leaks
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    loadProducts(): void {
        console.log('Loading products...'); // Debug log
        this.productService.getProducts().subscribe({
            next: (products) => {
                console.log('Products received:', products); // Debug log
                this.products = products;
            },
            error: (error) => {
                console.error('Error loading products:', error); // Debug log
                this.snackBar.open('Error loading products: ' + error.message, 'Close', {
                    duration: 5000
                });
            }
        });
    }

    viewProduct(id: number): void {
        this.router.navigate(['/products', id]);
    }

    editProduct(id: number): void {
        this.router.navigate(['/products', id, 'edit']);
    }

    createProduct(): void {
        this.router.navigate(['/products/create']);
    }

    deleteProduct(product: Product): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete Product',
                message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.productService.deleteProduct(product.id).subscribe({
                    next: () => {
                        this.snackBar.open('Product deleted successfully', 'Close', {
                            duration: 3000
                        });
                        this.loadProducts();
                    },
                    error: (error) => {
                        this.snackBar.open('Error deleting product: ' + error.message, 'Close', {
                            duration: 5000
                        });
                    }
                });
            }
        });
    }
}
