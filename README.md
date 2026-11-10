# QUIET BATTLES™ – Premium Fashion E-Commerce Platform

**Tagline: WEAR YOUR BATTLES.**

QUIET BATTLES™ is a premium fashion and lifestyle e-commerce web application developed as a full-stack project. It combines a cinematic brand experience with product browsing, shopping cart management, customer authentication, order processing, and administrative content management.

## Live Demo

**Public Preview:** https://pubs-aka-particular-accepted.trycloudflare.com

> Note: This is a temporary Cloudflare Quick Tunnel URL. The demo is accessible only while the development computer, backend services, frontend preview server, and tunnel are running. The URL may change when the tunnel is restarted.

## Project Features

### Customer Website
- Premium, responsive homepage and brand introduction.
- Series and collection browsing.
- Chapter-based storytelling and product associations.
- Product details with images, descriptions, pricing, and size selection.
- Shopping cart with quantity management.
- Customer registration and login.
- Checkout and order confirmation.
- My Orders and order cancellation.
- Responsive layouts for desktop and mobile devices.

### Admin Dashboard
- Protected administrator access.
- Series creation, editing, and management.
- Chapter creation, editing, and management.
- Product creation, editing, and management.
- Image and content management through image URLs.

### Backend Integration
- REST API integration through a centralized API Gateway.
- JWT-based authentication.
- Role-based access control for customers and administrators.
- Separate microservices for identity, content, products, and orders.
- Order-related stock reservation and restoration.
- MySQL database integration.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML5, CSS3 |
| Build Tool | Vite |
| Routing | React Router |
| HTTP Client | Axios |
| Icons | Lucide React |
| Backend | Java 17, Spring Boot |
| Security | Spring Security, JWT |
| Database | MySQL |
| Persistence | Spring Data JPA, Hibernate |
| API Documentation | Swagger / OpenAPI, where configured |
| Build Tool | Maven |
| Version Control | Git, GitHub |
| Testing Tools | Postman |

## Application Architecture

The frontend communicates with the backend through a centralized API Gateway.

The backend is divided into independent microservices:

1. **API Gateway – Port 8090:** Central entry point for frontend API requests.
2. **Identity Service – Port 8091:** Customer registration, login, JWT authentication, and roles.
3. **Content Service – Port 8092:** Series and chapter management.
4. **Product Service – Port 8093:** Product management and stock operations.
5. **Order Service – Port 8094:** Order creation, order history, cancellation, and order processing.

Each backend service uses its own MySQL database.

## Local Setup

### Prerequisites
- Node.js and npm
- Java 17
- Maven
- MySQL
- Git

### 1. Clone the frontend repository

```bash
git clone https://github.com/Pooji2002/quiet_battles_frontend.git
```

### 2. Open the frontend directory

```bash
cd quiet_battles_frontend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure the backend

Ensure that MySQL is running, the required databases are configured, and all five backend services are started.

The frontend uses the `/api` base path. Vite forwards API requests to the API Gateway at `http://127.0.0.1:8090`.

### 5. Start the development server

```bash
npm run dev
```

### 6. Create a production build

```bash
npm run build
```

### 7. Run the production preview

```bash
npm run preview
```

The production preview is available at:

`http://127.0.0.1:4173`

## API Routing

The frontend communicates with the backend using the following API prefixes:

| API Prefix | Backend Service |
|---|---|
| `/api/auth/**` | Identity Service |
| `/api/content/**` | Content Service |
| `/api/products/**` | Product Service |
| `/api/orders/**` | Order Service |

All requests are routed through the API Gateway.

## Security

- JWT authentication for protected operations.
- Role-based access for USER and ADMIN.
- Protected administrative functionality.
- Internal service authentication for secured service-to-service operations.

## Image and Content Management

Product and chapter images are managed using image URLs. Administrators can associate image URLs with the corresponding content through the admin dashboard.

## Project Repository

**Frontend:** https://github.com/Pooji2002/quiet_battles_frontend

The backend services are maintained in separate GitHub repositories.

## Developer Note

This application is a demonstration implementation of a premium fashion and lifestyle e-commerce platform. The brand identity, sample series, chapters, and product content are prototype materials created for the project.

