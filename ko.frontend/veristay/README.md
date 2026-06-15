# Trainers Council LMS Platform

A comprehensive Learning Management System (LMS) platform for Private Security Companies to offer accredited training courses in compliance with PSiRA regulations.

## 🚀 Features

- Course Management
- Student Progress Tracking
- Certification Management
- PSiRA Compliance Tools
- Role-based Access Control
- Interactive Learning Paths

## 📁 Project Structure

```
/app
├── (platform)/              # Platform routes
│   ├── courses/            # Course management
│   ├── learn/             # Student learning area
│   ├── manage/            # Training partner dashboard
│   └── admin/             # Admin section
├── (landing)/             # Public landing pages
├── components/            # Shared components
├── data/                  # Data management
│   └── seed/             # Seed data for development
└── lib/                   # Utility functions
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (for production)

### Setup

1. Clone the repository

```bash
git clone https://github.com/your-org/trainerscouncil.app.git
cd trainerscouncil.app
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

4. Run the development server

```bash
npm run dev
```

## 📚 Documentation

### Data Structure

The application uses the following main data types:

- Courses
- Users (Students, Instructors, Admins)
- Certifications
- Modules
- Progress Tracking

### API Routes

- `/api/courses` - Course management
- `/api/users` - User management
- `/api/certifications` - Certification handling
- `/api/progress` - Progress tracking

## 🔒 Security

- Role-based access control
- PSiRA compliance checks
- Secure file handling
- Audit logging

## 🧪 Testing

```bash
npm run test
```

## 📦 Deployment

1. Build the application

```bash
npm run build
```

2. Start the production server

```bash
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- PSiRA for compliance guidelines
- Next.js team for the amazing framework
- All contributors and supporters
