export interface Product {
    id: number;
    name: string;
    price: number;
    description: string | null;
    stock: number;
}

export interface ProductCreate {
    name: string;
    price: number;
    description?: string | null;
    stock: number;
}

export interface ProductUpdate {
    name?: string;
    price?: number;
    description?: string | null;
    stock?: number;
}

export interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: Product;
}

export interface CartItemAdd {
    product_id: number;
    quantity: number;
}
