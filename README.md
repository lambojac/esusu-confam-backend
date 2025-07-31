
# README.md
# Esusu Confam Backend API

A comprehensive group management platform API built with NestJS, MongoDB, and JWT authentication.

## Features

- **User Management**: Registration, login, and profile management
- **Group Management**: Create, search, join, and manage groups
- **Authentication**: JWT-based authentication with secure password hashing
- **Authorization**: Role-based access control for group operations
- **API Documentation**: Swagger/OpenAPI documentation

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd esusu-confam-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB service
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud service
```

5. Run the application
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Environment Variables

```env
DATABASE_URL=mongodb://localhost:27017/esusu-confam
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
PORT=3000
```

## API Documentation

Once the application is running, visit:
- API Documentation: `http://localhost:3000/api-docs`
- Health Check: `http://localhost:3000`

## Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # User management module
├── groups/         # Group management module
├── common/         # Shared utilities and decorators
├── app.module.ts   # Main application module
└── main.ts         # Application entry point
```

## Features Overview

### Authentication
- User registration with email validation
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Protected routes with JWT guards

### User Management
- User profile management
- One group per user constraint
- User group status tracking

### Group Management
- Create public/private groups
- Search and join public groups
- Invite-only private groups with codes
- Admin controls for member management
- Join request approval system
- Member removal capabilities

## Scripts

- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License