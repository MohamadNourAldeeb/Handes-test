# 🚀 Handes Backend Assessment

> A comprehensive backend system built with [Express.js](https://expressjs.com/), [Redis](https://redis.io/), and [MySQL](https://www.mysql.com/) for Handes.co technical evaluation

## 📋 Project Overview

**Handes Backend System** is a robust API solution featuring:

- 🔐 **Secure Authentication**
  - JWT-based auth with refresh tokens
  - Email verification workflow
  - Password reset functionality
- 📝 **Note Management**
  - Full CRUD operations
  - Advanced search capabilities
- 🛡️ **Security Features**
  - Web Application Firewall (WAF)
  - Security logging with email alerts
  - Helmet.js and CORS protection

## ⚙️ Feature

| Feature                     | Description                                     |
| --------------------------- | ----------------------------------------------- |
| 🔐 Environment-Based Config | All settings controlled via `.env` file         |
| 📦 Redis Caching            | Improves performance and reduces DB load        |
| 👤 Authentication           | Secured using JWT tokens                        |
| 📝 Notes Management         | Create, read, update, delete, and search notes  |
| 🛡️ Security                 | Uses Helmet, CORS, and rate-limiting middleware |
| 📧 Email Verification       | Powered by Nodemailer                           |
| 🔒 AES Encryption           | For secure data handling                        |
| 📋 Logs & WAF               | Logs events and prevents common threats         |

## ⚙️ Technical Specifications

| Component      | Technology |
| -------------- | ---------- |
| Framework      | Express.js |
| Database       | MySQL      |
| ORM            | Sequelize  |
| Cache          | Redis      |
| Authentication | JWT        |

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MySQL 8.0+
- Redis 6.0+

### Installation

### 1. Clone the repository

```bash
git clone https://github.com/MohamadNourAldeeb/Handes-test.git
cd Handes-test
```

### 2. Install dependencies

```bash
npm install
```

Ensure **Redis** is installed if not already available:  
👉 [How to install Redis](https://redis.io/download/)

### 3. Setup environment variables

Create a `.env` file in the root directory with the following content:

```env
# PORT AND LINK
PORT=3000
LINK=http://localhost

# DATABASE INFORMATION
DB_PORT=3306
DB_HOST=localhost
DB_NAME=hndes
DB_USER=root
DB_PASSWORD=""

# REDIS INFORMATION
REDIS_PORT=6379
REDIS_HOST=localhost
REDIS_PASSWORD=
REDIS_DB_NUMBER=1

# SERVER RUN TYPE
NODE_ENV=development

# JWT SECRETS INFORMATION
TOKEN_SECRET_KEY = your_jwt_secret_key_here
REFRESH_TOKEN_SECRET_KEY = your_refresh_jwt_secret_key_here
TOKEN_EXPIRES_IN = 12h
REFRESH_TOKEN_EXPIRES_IN = 30d

# AES ENCRYPTION INFORMATION
AES_SECRET_KEY = your_aes_32_byte_key_here
HASH_SECRET = your_hash_secret_here

# nodemailer INFORMATION
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_PORT=587
EMAIL_HOST=smtp.gmail.com

# OTHER
API_KEY=your_api_key
PROJECT_NAME=handes-co-test
```

> 💡 Replace placeholder values (`your_jwt_secret_key_here`, etc.) with secure ones before deployment.

---

### 4. Start the development server

```bash
npm run start:dev
```

The server will be available at:  
🔗 [`http://localhost:3000`](http://localhost:3000)

---

## 🔍 Evaluation Criteria

This implementation demonstrates:

✅ Clean and scalable architecture  
✅ Production-ready security (JWT, Helmet, CORS)  
✅ Efficient use of Redis for caching  
✅ Secure handling of sensitive data (encryption, email)  
✅ Robust error handling and logging

---

## ❤️ Contribution

Contributions are always welcome!  
Feel free to open issues or submit pull requests to help improve this project.

---

## 📄 License

MIT © Eng: Mohammad Noor Al-Deeb

---
