import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product, ProductCreate, ProductUpdate } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:8001/products';

    // HTTP options to prevent caching
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        })
    };

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    createProduct(product: ProductCreate): Observable<Product> {
        return this.http.post<Product>(`${this.apiUrl}/`, product, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    updateProduct(id: number, product: ProductUpdate): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, product, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

    deleteProduct(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions)
            .pipe(catchError(this.handleError));
    }

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
        return throwError(() => new Error(errorMessage));
    }
}
