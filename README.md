[Roadmap.sh Project: E-commerce API](https://roadmap.sh/projects/ecommerce-api)

# E-Commerce API

A full-stack e-commerce application built with **Java, Spring Boot, React, and SQLite**, featuring product management, inventory, shopping carts, order processing, authentication, and Stripe test payments.

## Features

* **Authentication and authorization:** JWT-based authentication with protected customer and admin routes.
* **Product management:** Browse products and perform admin product creation, editing, and deletion.
* **Inventory management:** Manage product stock.
* **Shopping cart:** Add and manage items in the cart.
* **Order management:** Place orders, view order details, and update order statuses through the admin interface.
* **Payments:** Stripe test-mode integration with webhook handling.
* **Admin dashboard:** Manage products, inventory, and orders from a React interface.

## Tech Stack

**Backend**

* Java
* Spring Boot
* Spring Security
* Spring Data JPA / Hibernate
* SQLite
* JWT
* Stripe Java SDK
* Maven

**Frontend**

* React
* Vite
* JavaScript
* CSS

## Project Structure

```text
ecommerce/
├── frontend/       # React + Vite frontend
├── src/            # Spring Boot backend source
├── pom.xml         # Maven configuration
├── mvnw            # Maven wrapper (Unix)
├── mvnw.cmd        # Maven wrapper (Windows)
└── .gitignore
```

## Prerequisites

* Java 17 or a compatible version for the configured project
* Node.js and npm
* Stripe test-mode credentials for payment testing

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Crosby01/ecommerce-API.git
cd ecommerce
```

Navigate to the directory containing `pom.xml` if your cloned repository has an additional nested folder.

### 2. Configure environment variables

Create a `.env` file in the backend project root and configure the environment variables required by your application, including your JWT secret and Stripe credentials.

Use the variable names referenced in your application configuration and Java code. **Never commit real secrets or API keys.**

### 3. Start the backend

From the directory containing `pom.xml`, run:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend normally starts on `http://localhost:8080`, unless configured otherwise.

### 4. Start the frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Testing

Run the backend tests from the directory containing `pom.xml`:

```powershell
.\mvnw.cmd test
```

Use Stripe test-mode credentials when testing payments. Never use live payment credentials for local development.

## Security Notes

* Keep `.env` and all real credentials out of version control.
* Do not commit your local SQLite database.
* Use environment variables for deployment secrets.
* Configure appropriate CORS and production security settings before deployment.

## Status

The core application features have been implemented, and the project is moving toward deployment. Some environment-specific configuration may be required to run it outside the local development setup.

