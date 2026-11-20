# KidsWear – Kids Clothing E-Commerce Website

A full-stack e-commerce application for browsing and purchasing kids' clothing, with separate user and admin functionalities.

## Tech Stack

**Frontend**
- React
- JavaScript
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- React Hot Toast

**Backend**
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server

## Features

### User
- User registration and login
- JWT-based authentication
- Browse and search products
- Filter products by category
- View product details, sizes, colors, and images
- Add and remove wishlist items
- Add and manage cart items
- Manage delivery addresses
- Place and view orders
- Cash on Delivery
- Online payments using Razorpay (Test Mode)

### Admin
- Admin authentication and role-based access
- Admin Dashboard
- Manage products
- Manage orders
- Manage users

## Getting Started

### 1. Clone the repository

```bash
git clone <frontend-repository-url>
```

### 2. Navigate to the project folder

```bash
cd kids-wear-store
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the development server

```bash
npm run dev
```

The frontend will be available at:

`http://localhost:5173`

## Backend

The backend is maintained in a separate repository:

[KidsWear Backend](https://github.com/misnaa-pp/Ecommerce-Backend)

Make sure the ASP.NET Core backend and SQL Server database are configured and running before using the application.

## Project Purpose

This project was developed to gain practical experience in full-stack web development, REST API integration, authentication, database management, and payment gateway integration.