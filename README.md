# STEMLearn

A web application designed to provide free, accessible, and interactive STEM education to students in Kenya, built using React and Flask.

## Description

STEMLearn is an online learning platform that bridges the gap in access to quality STEM (Science, Technology, Engineering, and Mathematics) education. It offers structured courses, interactive content, and progress tracking tailored to the Kenyan curriculum. The platform is designed to be free and accessible, ensuring that students from all backgrounds can benefit from high-quality educational resources.

This project demonstrates core React and Flask concepts, including:

- User authentication and role-based access control.
- Course and lesson management.
- Interactive quizzes and assignments.
- Progress tracking and certification.

## Screenshot

![STEMLearn Screenshot](.images/STEMLearn.png)

## Features

### User Registration and Authentication

- Secure user registration and login with email and password.
- JWT-based authentication for secure access control.
- Different user roles: Admin, Teachers, and Students.

### Home & Course Catalog

- Display available STEM courses categorized by subject (Mathematics, Physics, Chemistry, Biology, Computer Science, Engineering, etc.).
- Search and filter functionality to help students find relevant courses easily.

### Course Pages

- Detailed course descriptions, including syllabus, duration, and learning outcomes.
- Allow students to enroll in courses.
- Display a list of lessons and downloadable resources.

### Course Content Delivery

- Support for videos, PDFs, interactive quizzes, and assignments.
- Structured lesson-by-lesson progression.
- Discussion section for student-teacher interaction.

### Student Dashboard & Progress Tracking

- Show enrolled courses with completion percentage.
- Track progress per lesson and module.
- Display achievements and certificates of completion.

### Admin Dashboard

- Create and manage courses.
- Add and assign teachers to courses.
- Enroll students into specific courses manually if needed.
- Monitor student activity and progress analytics.

### Teacher Dashboard

- Upload course materials (videos, notes, quizzes, and assignments).
- Track student progress within assigned courses.
- Provide feedback on assignments and answer student queries.

### Assessments & Certification

- Implement quizzes and assignments for students to test their knowledge.
- Issue certificates upon successful completion of a course.

## How to Use

### Requirements

- A computer, tablet, or phone.
- Access to the internet.
- A modern web browser.

### View Live Site

Visit the deployed application at: [STEMLearn Live Site](http://superb-duckanoo-18547b.netlify.app/
Resources
)

The live site allows you to:

- Browse and enroll in STEM courses.
- Track your progress and achievements.
- Access course materials and interact with teachers.

### Local Development

If you want to run the project locally, you'll need:

- Node.js installed on your computer.
- Python (v3.8 or higher) for the Flask backend.
- Basic understanding of React and Flask.
- Code editor (VS Code recommended).
- Terminal/Command Line.

### Installation Process

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/stemlearn.git
   ```

2. Navigate to the project directory:

   ```bash
   cd stemlearn
   ```

3. Set up the frontend:

   ```bash
   cd stemlern
   npm install
   ```

4. Set up the backend:

   ```bash
   cd STEMLearn_db

   pipenv install

   pipenv shell
   ```

5. Run the development servers:

   - Start the backend:

     ```bash
     python app.py
     ```

   - Start the frontend:
     ```bash
     npm start
     ```

6. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Technologies Used

- **Frontend:** React, Tailwind CSS, JavaScript (ES6)
- **Backend:** Flask, SQLAlchemy, Python
- **Database:** SQLite (for development)
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:**
- **Frontend:** Netlify
- **Backend:** Render

## Backend API

[STEMLearn Live Site](https://stemlearn-db.onrender.com
Resources

)

## Contributing

If you want to contribute to the project, please follow these steps:

1. Fork this repository:

   - Click the "Fork" button at the top right of this repository to create a copy in your GitHub account.

2. Clone your Fork:

   ```bash
   git clone https://github.com/your-username/stemlearn.git
   cd stemlearn
   ```

3. Create a new branch:

   ```bash
   git switch -c your_branch_name
   ```

4. Make your changes:

   ```bash
   Add new features, fix bugs, or improve documentation.
   ```

5. Add and commit your changes:

   ```bash
   git add .
   git commit -m "Your commit message"
   ```

6. Push your changes:

   ```bash
   git push origin your_branch_name
   ```

7. Create a new pull request:
   - Go to the original repository on GitHub.
   - Click on "Pull Requests" and then "New Pull Request".
   - Select your branch and provide a clear description of your changes.
   - Submit the pull request for review.

## License

MIT License © 2024 [Your Name] ([Your GitHub Username])

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
