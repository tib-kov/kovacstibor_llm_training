import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CartItem, CartItemAdd } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly apiUrl = 'http://localhost:8000/cart';
    private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    public cartItems$ = this.cartItemsSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadCartItems();
    }

    /**
     * Get all cart items from the API
     */
    getCartItems(): Observable<CartItem[]> {
        return this.http.get<CartItem[]>(`${this.apiUrl}/`)
            .pipe(
                tap(items => this.cartItemsSubject.next(items)),
                catchError(this.handleError)
            );
    }

    /**
     * Add item to cart
     */
    addToCart(cartItem: CartItemAdd): Observable<CartItem> {
        return this.http.post<CartItem>(`${this.apiUrl}/add`, cartItem)
            .pipe(
                tap(() => this.loadCartItems()),
                catchError(this.handleError)
            );
    }

    /**
     * Remove item from cart
     */
    removeFromCart(cartItemId: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${cartItemId}`)
            .pipe(
                tap(() => this.loadCartItems()),
                catchError(this.handleError)
            );
    }

    /**
     * Update cart item quantity
     */
    updateCartItemQuantity(cartItemId: number, quantity: number): Observable<CartItem> {
        return this.http.put<CartItem>(`${this.apiUrl}/${cartItemId}?quantity=${quantity}`, {})
            .pipe(
                tap(() => this.loadCartItems()),
                catchError(this.handleError)
            );
    }

    /**
     * Get total cart items count
     */
    getCartItemsCount(): number {
        return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Get total cart value
     */
    getCartTotal(): number {
        return this.cartItemsSubject.value.reduce((total, item) =>
            total + (item.product.price * item.quantity), 0
        );
    }

    /**
     * Load cart items privately
     */
    private loadCartItems(): void {
        this.http.get<CartItem[]>(`${this.apiUrl}/`)
            .pipe(catchError(this.handleError))
            .subscribe({
                next: (items) => this.cartItemsSubject.next(items),
                error: (error) => console.error('Error loading cart items:', error)
            });
    }

    /**
     * Handle HTTP errors
     */
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            if (error.error && error.error.detail) {
                errorMessage = error.error.detail;
            }
        }

        return throwError(() => errorMessage);
    }
}
