# Manufacturing Execution System (MES)

This project is a Manufacturing Execution System (MES) dashboard with two parts: a backend (`mes-backend`) using Node.js, PostgreSQL, and GraphQL, and a frontend (`mes-frontend`) built with Vue.js.

## Project Structure

```
parent_folder/ 
│
├── mes-backend/ # Backend folder with Node.js, GraphQL, PostgreSQL
├── mes-frontend/ # Frontend folder with Vue.js └── README.md # Project instructions
```

---

## Requirements

Make sure you have the following tools installed before starting:

- [Node.js](https://nodejs.org/en/) (version 14.x or higher)
- [PostgreSQL](https://www.postgresql.org/) (version 12.x or higher)
- [Vue CLI](https://cli.vuejs.org/) (optional, to run Vue dev server)

---

## Getting Started

### 1. Clone the repository

```
bash git clone https://github.com/your-repo-link.git
cd parent_folder
```

git clone https://github.com/your-repo-link.git
cd parent_folder

## 2. Backend Setup (mes-backend)
Navigate to the backend directory and follow the steps to get the Node.js backend running.

### Install dependencies:

```
cd mes-backend
npm install
```
### Setup environment variables:
Create a .env file in mes-backend directory based on the .env.example file.

```
DB_USER=database_user
DB_NAME=your_username
DB_PASSWORD= your_password
DB_HOST= your_hostname
DB_PORT= your_port
DB_DATABASE=postgres
```
### Start the backend server:

```
npm run serve
```

## 3. Frontend Setup (mes-frontend)
Navigate to the frontend directory and follow the steps to run the Vue.js frontend.

### Install dependencies:

```
cd ../mes-frontend
npm install
```

### Start the frontend server:
```
npm run dev
```
