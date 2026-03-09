# VueJS Frontend - Config Management Panel

A frontend application built with VueJS 3 and Vite for managing configurations and country-specific values.

## Table of Contents

* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Usage](#usage)
* [Authentication](#authentication)

---

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on example below and provide your configuration variables

4. Start the server:

```bash
npm run dev
```

The API will be available at `http://localhost:3001` (or your configured port).

--> Current Deployment URL: https://app-config-panel.vercel.app

Admin credentials:  `admin@auth.co` ~  `123456`

---

## Environment Variables

VITE_FRONTEND_API_URL – URL where the frontend application is hosted (e.g., http://localhost:5173 for development)

VITE_BACKEND_API_URL – Base URL of the backend API server

VITE_FIREBASE_API_KEY – Firebase API key used to authenticate requests from your app

VITE_FIREBASE_AUTH_DOMAIN – Firebase authentication domain for handling user sign-in

VITE_FIREBASE_PROJECT_ID – Unique identifier of your Firebase project

VITE_FIREBASE_STORAGE_BUCKET – Firebase storage bucket used for file uploads

VITE_FIREBASE_SENDER_ID – Firebase Cloud Messaging sender ID

VITE_FIREBASE_APP_ID – Unique Firebase app identifier

# Example .env file

VITE_FRONTEND_API_URL=http://localhost:5173

VITE_BACKEND_API_URL=http://localhost:3001

VITE_FIREBASE_API_KEY=your_api_key

VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com

VITE_FIREBASE_PROJECT_ID=your_project_id

VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

VITE_FIREBASE_SENDER_ID=your_sender_id

VITE_FIREBASE_APP_ID=your_app_id

---

## Usage

This API allows you to manage configurations for mobile clients and their country-specific values.
It supports standard CRUD operations and requires authentication for creating, updating, and deleting resources.

LLM assistance helps manager to bulk create values for configurations according to country audiences.

---

## Authentication

The frontend sends tokens in the `Authorization` header for protected backend endpoints:

```
Authorization: Bearer <your-token>
```

Ensure you are logged in to perform actions like creating, updating, or deleting configurations.

---
