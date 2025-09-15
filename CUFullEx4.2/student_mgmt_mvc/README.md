# Student Management System (MVC) - Node.js + Express + MongoDB (Mongoose)

### Features
- Create, Read, Update, Delete students
- MVC structure: models, views (EJS), controllers, routes
- Uses MongoDB through Mongoose

### Setup
1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. Install dependencies:
   ```
   npm install
   ```
3. Run:
   ```
   npm run dev
   ```
4. Open http://localhost:3000

### Structure
```
/student_mgmt_mvc
  app.js
  package.json
  .env.example
  /models
    Student.js
  /controllers
    studentController.js
  /routes
    studentRoutes.js
  /views
    layout.ejs
    index.ejs
    add.ejs
    edit.ejs
  /public
    /css
      styles.css
```
