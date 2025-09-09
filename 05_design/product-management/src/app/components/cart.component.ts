import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/product.model';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg max-w-sm z-50" 
         *ngIf="cartItems.length > 0">
      <!-- Cart Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">Shopping Cart</h3>
        <div class="flex items-center gap-2">
          <span class="bg-primary text-white text-xs px-2 py-1 rounded-full">
            {{ getTotalItems() }}
          </span>
          <button 
            (click)="toggleCart()"
            class="text-gray-500 hover:text-gray-700">
            <svg *ngIf="!isMinimized" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
            <svg *ngIf="isMinimized" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="18,15 12,9 6,15"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <!-- Cart Items -->
      <div *ngIf="!isMinimized" class="max-h-64 overflow-y-auto">
        <div *ngFor="let item of cartItems" 
             class="flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0">
          <!-- Product Info -->
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-800 truncate">{{ item.product.name }}</h4>
            <p class="text-xs text-gray-600">\${{ item.product.price.toFixed(2) }}</p>
          </div>

          <!-- Quantity Controls -->
          <div class="flex items-center gap-2">
            <button 
              (click)="decreaseQuantity(item)"
              class="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium">
              -
            </button>
            <span class="text-sm font-medium min-w-[20px] text-center">{{ item.quantity }}</span>
            <button 
              (click)="increaseQuantity(item)"
              class="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium">
              +
            </button>
          </div>

          <!-- Remove Button -->
          <button 
            (click)="removeFromCart(item)"
            class="text-red-500 hover:text-red-700 p-1">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 01-2,2H7a2,2 0 01-2-2V6m3,0V4a2,2 0 012-2h4a2,2 0 012,2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Cart Total -->
      <div *ngIf="!isMinimized" class="p-4 bg-gray-50 border-t border-gray-200">
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-800">Total:</span>
          <span class="text-lg font-bold text-primary">\${{ getCartTotal().toFixed(2) }}</span>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host {
      position: fixed;
      bottom: 1rem;
      left: 1rem;
      z-index: 50;
    }
  `]
})
export class CartComponent implements OnInit, OnDestroy {
    cartItems: CartItem[] = [];
    isMinimized = false;
    private subscription: Subscription = new Subscription();

    constructor(private cartService: CartService) { }

    ngOnInit(): void {
        this.subscription.add(
            this.cartService.cartItems$.subscribe(items => {
                this.cartItems = items;
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    toggleCart(): void {
        this.isMinimized = !this.isMinimized;
    }

    getTotalItems(): number {
        return this.cartService.getCartItemsCount();
    }

    getCartTotal(): number {
        return this.cartService.getCartTotal();
    }

    increaseQuantity(item: CartItem): void {
        const newQuantity = item.quantity + 1;
        this.cartService.updateCartItemQuantity(item.id, newQuantity).subscribe({
            next: () => {
                // Success handled by service
            },
            error: (error) => {
                console.error('Error updating cart item quantity:', error);
                // You might want to show a toast notification here
            }
        });
    }

    decreaseQuantity(item: CartItem): void {
        if (item.quantity > 1) {
            const newQuantity = item.quantity - 1;
            this.cartService.updateCartItemQuantity(item.id, newQuantity).subscribe({
                next: () => {
                    // Success handled by service
                },
                error: (error) => {
                    console.error('Error updating cart item quantity:', error);
                }
            });
        } else {
            this.removeFromCart(item);
        }
    }

    removeFromCart(item: CartItem): void {
        this.cartService.removeFromCart(item.id).subscribe({
            next: () => {
                // Success handled by service
            },
            error: (error) => {
                console.error('Error removing item from cart:', error);
            }
        });
    }
}
