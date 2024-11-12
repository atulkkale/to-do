# To-Do Backend (Machine Test for elRed)

This **To-Do** project is a backend-only application developed as part of a machine test for elRed. It includes a RESTful API for user authentication and task management, complete with email verification and OTP security. Users can create, update, delete, and rearrange tasks. API documentation is provided via Swagger, allowing for easy testing and interaction.

The project is hosted on Render, a free platform where inactive sites may take up to 60 seconds or more to load.

## Project Overview

The To-Do backend application allows users to manage tasks after secure sign-up and sign-in. Key features include email-based OTP verification during sign-up and pagination for efficient task retrieval.

## Features

- **User Authentication**
  - **Sign-Up & Login**: Users register and log in with email verification.
  - **OTP Verification**: An OTP is sent to the user’s email at sign-up, which must be verified to activate the account.
  - **Email Verification**: Only verified users can log in, ensuring account security.
  - **JWT**: Authentication tokens are generated for secure session management.

- **Task Management**
  - **CRUD Operations**: APIs to Create, Read, Update, and Delete tasks.
  - **Rearrange Tasks**: Tasks can be rearranged as needed.
  - **Task Fields**: Each task includes fields for name, date, and status.
  - **Pagination**: Enhanced GET API with pagination support for optimized data retrieval.

- **Swagger Documentation**: Comprehensive API documentation through Swagger for easy testing and interaction.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Framework for building the REST API.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB and Node.js.
- **JWT**: JSON Web Tokens for secure session management.
- **SendGrid**: Service for sending OTP verification emails.
- **Swagger**: API documentation tool.

# API Documentation

API documentation is available through Swagger. Access it to test and view all endpoints at Swagger [Docs](https://to-do-fvq1.onrender.com/api-docs/).

## Getting Started

To set up and run this project locally:

1. Clone this repository:

```bash
git clone https://github.com/atulkkale/to-do.git
cd to-do
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in a .env file, including DB_URI, PORT=3000, DATABASE_DRIVER, NODE_ENV, SEND_GRID_API_KEY and JWT_SECRET_KEY.

4. Run the app:

```bash
npm start
```

5. Access Swagger Docs locally:
   Visit http://localhost:3000/api-docs/ to view and test the API documentation.

## Project Link

You can access the deployed app on Render [here](https://to-do-fvq1.onrender.com/api-docs/).

*`Note: Render's free hosting plan may cause the site to take up to 60 seconds or more to load initially due to inactivity.`*


## Future Improvements

- Integrate frontend for full user interaction.
- Add search and filtering options for tasks.

## Screenshots

<img width="1680" alt="Screenshot 2024-11-12 at 10 15 42 PM" src="https://github.com/user-attachments/assets/7e2fa1a9-3fdb-44ce-9b3b-79bf0ed69dd7">
