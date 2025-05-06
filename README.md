create-nodejs-api
A CLI tool for creating Node.js REST API projects with TypeScript or JavaScript, inspired by create-react-app.
Features

Interactive CLI with beautiful prompts using @clack/prompts
Colorful terminal output with chalk
Generates a complete Node.js REST API project structure
Supports both TypeScript and JavaScript
Provides a working example API with CRUD operations
Includes middleware for error handling, security, and logging

Installation
Global Installation (recommended)
bashnpm install -g create-nodejs-api
Using npx (no installation)
bashnpx create-nodejs-api
Usage
bashcreate-nodejs-api
Follow the interactive prompts to:

Specify your project name
Choose the project location
Select the language (TypeScript or JavaScript)

The CLI will then create a new directory with the specified name and generate a complete REST API project structure.
Project Structure
The generated project will have the following structure:
your-project/
├── src/
│ ├── config/
│ │ └── db.ts (or db.js)
│ ├── controllers/
│ │ └── itemController.ts (or itemController.js)
│ ├── middleware/
│ │ └── errorHandler.ts (or errorHandler.js)
│ ├── models/
│ │ └── itemModel.ts (or itemModel.js)
│ ├── routes/
│ │ └── itemRoutes.ts (or itemRoutes.js)
│ └── index.ts (or index.js)
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json (for TypeScript projects only)
API Endpoints
The generated API comes with the following endpoints:

GET /api/items - Get all items
GET /api/items/:id - Get a specific item
POST /api/items - Create a new item
PUT /api/items/:id - Update an item
DELETE /api/items/:id - Delete an item

Development
To develop this CLI tool locally:

Clone the repository
Install dependencies: npm install
Run in development mode: npm run dev
Build for production: npm run build

License
MIT
