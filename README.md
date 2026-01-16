Alpine Commerce Platform – Technical Documentation
1. System Overview

Alpine is a full-stack e-commerce platform built for selling premium Kashmiri dry fruits, oils, and organic food products.

The system consists of:

Layer	Technology
Frontend (Store)	React + TypeScript
Admin Dashboard	React + TypeScript
Backend API	Node.js + Express
Database	PostgreSQL (via Sequelize ORM)
Payments	Razorpay
Media	Image uploads + Base64 encoding
Auth	JWT token based
2. High-Level Architecture
Browser (Customer / Admin)
        |
        ▼
React Frontend (Store / Admin)
        |
        ▼
REST API (Node + Express)
        |
        ▼
PostgreSQL Database
        |
        ▼
Razorpay Payment Gateway

3. Core Domain Model
Category

Represents a product group (e.g. Dry Fruits, Oils, Grains)

Field	Type
id	number
name	string
description	string
category_icon	file
sequence	number
Product

A product is a container for variants.

Field	Type
id	number
name	string
description	text
richDescription	text
itemId	SKU prefix
currency	string
isBestSelling	boolean
hsnCode	string
taxRate	number
categoryId	FK

Each product belongs to one category and has many variants.

ProductVariant

Each purchasable unit (500g, 1kg, etc)

Field	Type
id	number
productId	FK
unitValueId	FK
quantity	number
price	decimal
comparePrice	decimal
sku	string
stock	integer
barcode	string
discount	%
isDefaultVariant	boolean
isActive	boolean
razorpayItemId	string

Only variants are sold — products are containers.

UnitValue

Used for weight/packaging.

id	name	symbol
1	Kilogram	Kg
2	Gram	g
3	Litre	L
Image

Stores product images.

| id | imagePath | productId |

Images are stored on disk, returned to frontend as Base64.

4. Payment Architecture

Each product variant has a Razorpay Item.

When creating a variant:

Variant → Razorpay Item
Price → Razorpay Amount


When ordering:

Order → Razorpay Payment Link → User Redirected → Payment → Callback


This ensures:

Correct tax

Correct SKU

Accurate billing

5. Checkout Flow
Cart
  ↓
Customer selects / creates address
  ↓
Order is created
  ↓
Razorpay Payment Link generated
  ↓
User redirected to Razorpay
  ↓
Payment success
  ↓
Thank-You page

6. Admin Panel Capabilities
Product Management

Admin can:

Create product

Upload images

Add multiple variants

Set default variant

Set price, stock, SKU

Toggle Best Seller

Delete product or variant

Category Management

Admin can:

Create category

Upload icon

Set display order

Unit Management

Admin can:

Add new units (Kg, g, L, etc)

7. Product APIs
API	Purpose
POST /createproduct	Create product with variants
PUT /updateproductById/:id	Update product
DELETE /deleteproductById/:id	Delete product
GET /product/:id	Get product
GET /product/ByCategoryId/:id	Products by category
GET /product/count	Product count
PUT /bestselling/state/:id	Toggle bestseller
8. Frontend State Architecture
Store	Purpose
useCartStore	Cart & wishlist
useCheckoutStore	Address & customer
useAuthStore	Admin login
useCategories	Categories
9. Pagination Strategy

Backend uses:

skip = (page - 1) * pageSize
top = pageSize


Frontend calculates:

totalPages = Math.ceil(total / pageSize)

10. Security Model
Feature	Implementation
Login	JWT
Admin routes	Token + Role
Razorpay	Server-side
File upload	Multer + validation
11. Why this Architecture is Correct

This system follows enterprise-grade commerce design:

Product ≠ Variant (industry standard)

Razorpay per-variant pricing

Category-based indexing

Review aggregation

Scalable pagination

Secure file uploads

This is the same structure used by:

Amazon

Flipkart

Shopify

BigBasket
