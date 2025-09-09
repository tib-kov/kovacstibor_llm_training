import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatChipsModule
    ],
    template: `
    <mat-toolbar>
      <button mat-icon-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span>Product Details</span>
      <span class="spacer"></span>
      <button mat-button color="accent" (click)="editProduct()" *ngIf="product">
        <mat-icon>edit</mat-icon>
        Edit
      </button>
      <button mat-button color="warn" (click)="deleteProduct()" *ngIf="product">
        <mat-icon>delete</mat-icon>
        Delete
      </button>
    </mat-toolbar>

    <div class="container">
      <div *ngIf="loading" class="loading">
        <mat-spinner></mat-spinner>
        <p>Loading product details...</p>
      </div>

      <mat-card *ngIf="product && !loading" class="product-detail-card">
        <mat-card-header>
          <mat-card-title class="product-title">{{ product.name }}</mat-card-title>
          <mat-card-subtitle class="product-price">\${{ product.price | number:'1.2-2' }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="detail-section">
            <h3>Description</h3>
            <p class="description">{{ product.description || 'No description available' }}</p>
          </div>

          <div class="detail-section">
            <h3>Stock Information</h3>
            <div class="stock-info">
              <mat-chip-set>
                <mat-chip [class]="getStockClass()">
                  <mat-icon>inventory</mat-icon>
                  {{ product.stock }} units available
                </mat-chip>
              </mat-chip-set>
            </div>
          </div>

          <div class="detail-section">
            <h3>Product Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <strong>Product ID:</strong>
                <span>{{ product.id }}</span>
              </div>
              <div class="info-item">
                <strong>Name:</strong>
                <span>{{ product.name }}</span>
              </div>
              <div class="info-item">
                <strong>Price:</strong>
                <span>\${{ product.price | number:'1.2-2' }}</span>
              </div>
              <div class="info-item">
                <strong>Stock:</strong>
                <span>{{ product.stock }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-raised-button color="primary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Back to List
          </button>
          <button mat-raised-button color="accent" (click)="editProduct()">
            <mat-icon>edit</mat-icon>
            Edit Product
          </button>
        </mat-card-actions>
      </mat-card>

      <div *ngIf="!product && !loading" class="error-state">
        <mat-icon class="large-icon">error</mat-icon>
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button mat-raised-button color="primary" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Back to List
        </button>
      </div>
    </div>
  `,
    styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
    }

    .loading mat-spinner {
      margin: 0 auto 20px;
    }

    .product-detail-card {
      margin-top: 20px;
    }

    .product-title {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .product-price {
      font-size: 20px;
      font-weight: bold;
      color: #4caf50;
    }

    .detail-section {
      margin: 24px 0;
    }

    .detail-section h3 {
      margin: 0 0 12px 0;
      color: #333;
      font-weight: 500;
    }

    .description {
      font-size: 16px;
      line-height: 1.5;
      color: #666;
      margin: 0;
    }

    .stock-info {
      margin-top: 8px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 12px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-item strong {
      font-size: 14px;
      color: #555;
    }

    .info-item span {
      font-size: 16px;
      color: #333;
    }

    .error-state {
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

    .stock-high {
      background-color: #4caf50;
      color: white;
    }

    .stock-medium {
      background-color: #ff9800;
      color: white;
    }

    .stock-low {
      background-color: #f44336;
      color: white;
    }

    .stock-out {
      background-color: #9e9e9e;
      color: white;
    }

    mat-card-actions {
      margin-bottom: 0;
      padding-top: 16px;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
    product: Product | null = null;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.loadProduct(id);
        } else {
            this.loading = false;
        }
    }

    loadProduct(id: number): void {
        this.productService.getProduct(id).subscribe({
            next: (product) => {
                this.product = product;
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                this.snackBar.open('Error loading product: ' + error.message, 'Close', {
                    duration: 5000
                });
            }
        });
    }

    editProduct(): void {
        if (this.product) {
            this.router.navigate(['/products', this.product.id, 'edit']);
        }
    }

    deleteProduct(): void {
        if (!this.product) return;

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Delete Product',
                message: `Are you sure you want to delete "${this.product.name}"? This action cannot be undone.`
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && this.product) {
                this.productService.deleteProduct(this.product.id).subscribe({
                    next: () => {
                        this.snackBar.open('Product deleted successfully', 'Close', {
                            duration: 3000
                        });
                        this.router.navigate(['/products']);
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

    goBack(): void {
        this.router.navigate(['/products']);
    }

    getStockClass(): string {
        if (!this.product) return 'stock-out';

        if (this.product.stock === 0) return 'stock-out';
        if (this.product.stock <= 5) return 'stock-low';
        if (this.product.stock <= 20) return 'stock-medium';
        return 'stock-high';
    }
}
