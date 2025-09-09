import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product, ProductCreate, ProductUpdate } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly apiUrl = 'http://localhost:8000/products';

    constructor(private http: HttpClient) { }

    /**
     * Get all products from the API
     */
    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/`)
            .pipe(catchError(this.handleError));
    }

    /**
     * Get a single product by ID
     */
    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    /**
     * Create a new product
     */
    createProduct(product: ProductCreate): Observable<Product> {
        return this.http.post<Product>(`${this.apiUrl}/`, product)
            .pipe(catchError(this.handleError));
    }

    /**
     * Update an existing product
     */
    updateProduct(id: number, product: ProductUpdate): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, product)
            .pipe(catchError(this.handleError));
    }

    /**
     * Delete a product
     */
    deleteProduct(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
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
