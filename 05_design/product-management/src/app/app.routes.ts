import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list.component';
import { ProductDetailComponent } from './components/product-detail.component';
import { ProductFormComponent } from './components/product-form.component';

export const routes: Routes = [
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: 'products', component: ProductListComponent },
    { path: 'products/new', component: ProductFormComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: 'products/:id/edit', component: ProductFormComponent },
    { path: '**', redirectTo: '/products' }
];
