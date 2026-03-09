# Configuration Management Platform

A web application for managing system configurations and country-specific parameter values with AI-assisted workflows.

The platform allows teams to define configuration parameters, customize them per country, and manage updates through a centralized interface. AI assistance helps users create and organize configuration values more efficiently.

The system consists of a web frontend and a backend service that exposes a REST API. Configuration parameters and their country-specific values are stored and managed through the backend, and can be fetched programmatically by external clients such as mobile applications.

### 🚀 Live Demo
https://app-config-panel.vercel.app

Admin credentials:  `admin@auth.co` ~  `123456`

### 📁 Project Structure

- /frontend → Vue application
- /backend → API server

### 🛠 Tech Stack

Frontend: VueJS

Backend: Node.js, Express  

Database: Firebase Firestore

Other: Firebase Authentication, OpenAI API

### ⚡ Quick Start

```bash
# Clone repo
git clone https://github.com/uoztunc18/app-config-panel.git

# Go into project
cd app-config-panel

# Install backend
cd backend
npm install

# Run backend
npm start

# Install frontend
cd ../frontend
npm install

# Run frontend
npm run dev

# Setup environment variables for both

```

### Login Page

<img width="1680" height="938" alt="signin-page" src="https://github.com/user-attachments/assets/8a2458f3-eb5d-49a6-a4cd-685fc0008d49" />

### Main Page

<img width="1680" height="936" alt="homepage" src="https://github.com/user-attachments/assets/bab4d87a-eb57-4c3e-aaf6-98247514db62" />
<img width="1680" height="939" alt="add-value-modal" src="https://github.com/user-attachments/assets/8aa9f1d2-ac2f-4db1-99bd-c4aaad2a5bd2" />
<img width="1680" height="938" alt="suggestion-modal" src="https://github.com/user-attachments/assets/aebbaaa6-aaa8-4652-b63c-781ef2c4e17f" />
