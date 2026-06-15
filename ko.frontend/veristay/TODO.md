# TODO.md

## 🎯 Project Context

This LMS platform enables Private Security Companies to offer accredited training courses in compliance with PSiRA regulations. Students can enroll in structured programs, and training providers can manage their offerings and compliance.

---

## 🧭 Features to Build / Improve

### ✅ Landing Page

- [x] Display CTAs: "Enroll as Student" and "Become a Training Partner"
- [x] Basic layout and structure
- [ ] Add sections for:
  - How it works (for students and partners)
  - PSiRA compliance explanation
  - Testimonials or partner showcase
  - FAQ or Help section

---

### 👤 Authentication & Role Management

- [ ] Implement secure login/signup
- [ ] Separate flows for:
  - Students
  - Training Partners (with approval process)
- [ ] Role-based access routing & UI rendering

---

### 🎓 Student Portal

- [x] Basic layout and navigation structure
- [x] Course Detail View (modules, assessments, resources)
- [x] Course Navigation (progress, assignments, discussions)
- [ ] Dashboard: show enrolled courses, progress, roadmap
- [ ] Course Enrollment Page
- [ ] Prerequisite Handling
- [ ] Roadmap feature (planned)
- [ ] Downloadable Certificate upon completion (PSiRA-compliant format)

---

### 🏫 Training Partner Dashboard

- [x] Basic layout and navigation structure
- [ ] Dashboard Overview (active courses, enrollments, compliance status)
- [ ] Course Management
  - Create/Edit/Delete courses
  - Set prerequisites
  - Upload materials & assessments
- [ ] Learner Tracking & Moderation Logs
- [ ] Upload Reports / Moderation Evidence
- [ ] Profile & Accreditation Verification

---

### 📋 Admin / Compliance Tools

- [x] Basic layout and navigation structure
- [ ] View and approve new Training Partners
- [ ] Generate reports (compliance, enrollment, certificate issuance)
- [ ] Audit Logs
- [ ] Integration (future) with PSiRA API

---

### 🧩 UI Component Wishlist

- [x] Role-based Layouts (Student, Partner, Admin)
- [x] Course Card Component
- [x] Content Viewer Component
- [x] Progress Tracker
- [ ] Enrollment Modal
- [ ] Certificate Viewer

---

### 🗂 Folder Structure Refactor (Planned)

- [x] Basic app structure with pages and components
- [x] Organize by domain (e.g. `/features/students`, `/features/partners`)
- [x] Centralize layout and theme components
- [ ] Add utils/hooks for shared logic (e.g. role detection)

---

### 🧪 Testing & QA

- [ ] Add route guards and test unauthorized access
- [ ] Validate accessibility and responsiveness
- [x] Create test data (mock students, courses, partners)

---

### 🚀 Future Features

- [ ] Roadmap UI for course progression
- [ ] Offline support for remote learners
- [ ] Bulk certificate issuing for class groups
- [ ] Training Partner Public Profiles

---

> Feel free to update this as development progresses. Use this as context when prompting LLMs or collaborating with teammates.
