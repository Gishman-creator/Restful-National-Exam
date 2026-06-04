# Fire Extinguisher Management System (Restful National Exam)

A comprehensive full-stack application for managing, tracking, inspecting, and reporting on fire extinguishers. This project is built using a modern microservices architecture on the backend and a Next.js application on the frontend.

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4, Base UI, Shadcn UI
- **State/Data Fetching**: React Query, Axios
- **Forms**: React Hook Form with Zod validation

### Backend (Microservices)
- **Runtime**: Node.js & Express
- **Database**: MongoDB with Mongoose
- **Architecture**: API Gateway pattern with multiple dedicated microservices
- **API Docs**: Swagger UI (tsoa)

## Project Structure

The project is split into two main directories:

### `/frontend`
Contains the Next.js web application. Includes the admin portal, user management, and dashboards for extinguishers and inspections.

### `/backend`
Houses the microservices ecosystem. Services include:
- **`api-gateway`** (Port 3000): Routes traffic to the correct microservice and aggregates Swagger API documentation.
- **`user-auth-service`** (Port 3001): Handles user registration, login, JWT authentication, and role management.
- **`extinguisher-service`** (Port 3002): Manages fire extinguisher inventory, locations, and details.
- **`inspection-service`** (Port 3003): Tracks inspection logs, statuses, and maintenance records.
- **`reporting-service`** (Port 3004): Generates analytical reports and metrics.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   *(Note: Running `npm install` in the backend root will automatically trigger a post-install script that installs dependencies for all microservices).*
   ```bash
   npm install
   ```
3. Start the backend services concurrently:
   ```bash
   npm run dev
   ```
   *This single command spins up the API Gateway and all microservices at once.*

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Access the application at [http://localhost:3000](http://localhost:3000) *(or the port specified by Next.js)*.

## API Documentation

Once the backend is running, the API Gateway provides a unified Swagger UI containing the documentation for all microservices.

Visit the interactive API docs at:
**[http://localhost:5000/docs](http://localhost:5000/docs)**

Use the "Select a definition" dropdown in the top bar to switch between the APIs of different services (Auth, Extinguisher, Inspection, Reporting).
