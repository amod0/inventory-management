# Inventory Management System

A backend-powered inventory management system built with Node.js, Express, and TypeScript, aimed at efficiently managing inventory records, reports, and staff activities.

## 🚀 Features

- User authentication with role-based access (Admin & Staff)
- Product and inventory CRUD operations
- Category and supplier management
- Invoice and image upload support using Multer
- Reporting system (Excel/CSV export) using Telerik Reporting
- PostgreSQL integration for reliable data storage
- Secure API endpoints with request validation
- Scalable project structure using MVC architecture

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **File Upload**: Multer
- **Reporting**: Telerik Reporting
- **Authentication**: JWT

## 📁 Project Structure

```
src/
├── controllers/
├── routes/
├── services/
├── middlewares/
├── models/
├── utils/
├── app.ts
├── config/
```

## 🔧 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/amod0/inventory-management.git
   cd inventory-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up `.env` file based on `.env.example`.

4. Run the project:
   ```bash
   npm run dev
   ```

## 📦 API Endpoints (Sample)

- `POST /api/login` – Login user
- `GET /api/products` – List products
- `POST /api/products` – Create product
- `PUT /api/products/:id` – Update product
- `DELETE /api/products/:id` – Delete product

## 📜 License

MIT

---

> Built with ❤️ by [Amod Pradhan](https://github.com/amod0)
