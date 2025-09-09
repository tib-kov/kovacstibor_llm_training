from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from database import Product, create_tables, get_db

app = FastAPI(title=settings.app_name)


class ProductCreate(BaseModel):
    name: str
    price: float
    description: Optional[str] = None
    stock: int


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    stock: Optional[int] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    description: Optional[str]
    stock: int

    class Config:
        from_attributes = True


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Template"}


@app.get("/products/", response_model=List[ProductResponse])
async def get_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product))
    products = result.scalars().all()
    return products


@app.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.id == product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product


@app.post("/products/", response_model=ProductResponse)
async def create_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.name == product.name))
    existing_product = result.scalar_one_or_none()
    
    if existing_product:
        raise HTTPException(status_code=400, detail="Product with this name already exists")
    
    db_product = Product(
        name=product.name,
        price=product.price,
        description=product.description,
        stock=product.stock
    )
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product


@app.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int, 
    product_update: ProductUpdate, 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Product).filter(Product.id == product_id))
    db_product = result.scalar_one_or_none()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_update.dict(exclude_unset=True)
    if "name" in update_data:
        new_name = update_data["name"]
        name_check_result = await db.execute(
            select(Product).filter(Product.name == new_name, Product.id != product_id)
        )
        existing_product = name_check_result.scalar_one_or_none()
        
        if existing_product:
            raise HTTPException(status_code=400, detail="Product with this name already exists")
    
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    await db.commit()
    await db.refresh(db_product)
    return db_product


@app.delete("/products/{product_id}")
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.id == product_id))
    db_product = result.scalar_one_or_none()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await db.delete(db_product)
    await db.commit()
    return {"message": "Product deleted successfully"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
