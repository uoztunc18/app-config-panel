# NodeJS REST API - Config Management

A RESTful API built with **NodeJS** and **Express** for managing configurations and country-specific values.

## Table of Contents

* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Usage](#usage)
* [Authentication](#authentication)
* [API Routes](#api-routes)
  * [Configs](#configs)
  * [Country-Specific Values](#country-specific-values)
  * [For Mobile Clients](#mobile)
* [Error Handling](#error-handling)

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
npm start
```

The API will be available at `http://localhost:3000` (or your configured port).

--> Current Deployment URL: https://app-config-panel.onrender.com

---

## Environment Variables

PORT – Port on which the server runs

API_URL – Base URL of the backend API

FRONTEND_URL – URL of the frontend app

DATABASE_URL – Database connection URL

FIREBASE_PROJECT_ID – Firebase project ID

FIREBASE_CLIENT_EMAIL – Firebase service account client email

FIREBASE_PRIVATE_KEY – Firebase private key

OPENAI_API_KEY - OpenAI API key

# Example .env file

PORT=3001

API_URL=http://localhost:3001

FRONTEND_URL=http://localhost:5173

DATABASE_URL=your_database_connection_url

FIREBASE_PROJECT_ID=your_firebase_project_id

FIREBASE_CLIENT_EMAIL=your_firebase_client_email

FIREBASE_PRIVATE_KEY="your_firebase_private_key"

OPENAI_API_KEY=your_openai_api_key

---

## Usage

This API allows you to manage configurations for mobile clients and their country-specific values.
It supports standard CRUD operations and requires authentication for creating, updating, and deleting resources.

---

## Authentication

Some endpoints require Firebase authentication. You must include an `Authorization` header:

```
Authorization: Bearer <your-token>
```

The middleware `isAuthenticated` handles authentication for these routes.

---

## API Routes

### Configs

| Method | Endpoint             | Description         | Auth Required |
| ------ | ---------------------| ------------------- | ------------- |
| GET    | `/configs`           | Get all configs     | No            |
| GET    | `/configs/:configId` | Get config by ID    | No            |
| POST   | `/configs`           | Create new config   | Yes           |
| PUT    | `/configs/:configId` | Update config by ID | Yes           |
| DELETE | `/configs/:configId` | Delete config by ID | Yes           |

### Country-Specific Values

| Method | Endpoint                                    | Description                                            | Auth Required |
| ------ | ------------------------------------------- | ------------------------------------------------------ | ------------- |
| GET    | `/configs/:configId/overrides`              | Get all country-specific values for a config           | No            |
| GET    | `/configs/:configId/overrides/:countryCode` | Get a value for a config with country code             | No            |
| PUT    | `/configs/:configId/overrides/:countryCode` | Create/update a country-specific value for a config    | Yes           |
| DELETE | `/configs/:configId/overrides/:countryCode` | Delete a country-specific value for a config           | Yes           |

### For AI


| Method | Endpoint             | Description         | Auth Required |
| ------ | ---------------------| ------------------- | ------------- |
| POST    | `/ai` | Ask for recommendations with a parameter name and its default value in the body | Yes   |

### For Mobile-Clients


| Method | Endpoint             | Description         | Auth Required |
| ------ | ---------------------| ------------------- | ------------- |
| GET    | `/configs?client=mobile` | Get all config key-values for mobile clients     | No   |

* For fetching configs with country-specific values if any config has, also include `country` param. Default value is returned if no value is specified for given country. For example: 

`/configs?client=mobile&country=TUR`
