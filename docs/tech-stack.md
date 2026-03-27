# 🛠️ Tech Stack Documentation

## 📌 Project Name

**GitVerify – Intelligent Resume Screening & GitHub Validation System**

---

## 🧩 1. Overview

This document outlines the technologies used to build GitVerify. The system is primarily developed using **Node.js**, focusing on backend-driven processing with integrated NLP techniques and external API usage.

---

## 💻 2. Frontend Technologies

| Technology | Purpose                   |
| ---------- | ------------------------- |
| HTML5      | Structure of web pages    |
| CSS3       | Styling and layout        |
| JavaScript | Client-side interactivity |

### Responsibilities

* Input forms (resume upload, GitHub links, job description)
* Display candidate scores and rankings
* Basic dashboard UI

---

## ⚙️ 3. Backend Technologies (Core)

| Technology    | Purpose                           |
| ------------- | --------------------------------- |
| Node.js       | Runtime environment               |
| Express.js    | Backend framework for APIs        |
| Multer        | Handling file uploads (resumes)   |
| Axios / Fetch | API requests (GitHub integration) |

### Responsibilities

* Resume parsing and preprocessing
* ATS scoring logic implementation
* GitHub data extraction and analysis
* Candidate ranking system

---

## 🗄️ 4. Database

| Technology | Purpose                                  |
| ---------- | ---------------------------------------- |
| MongoDB    | NoSQL database for storing data          |
| Mongoose   | Schema modeling and database interaction |

### Data Stored

* Candidate information
* Resume content
* GitHub analysis results
* Scores and rankings

---

## 🤖 5. NLP & Scoring Techniques

| Technique         | Purpose                      |
| ----------------- | ---------------------------- |
| TF-IDF            | Keyword importance weighting |
| Vector Embeddings | Semantic understanding       |
| Cosine Similarity | Resume-job matching          |

### Implementation

* Implemented using JavaScript-based libraries
* Custom scoring logic written in Node.js

---

## 🔗 6. External API Integration

| API             | Purpose                      |
| --------------- | ---------------------------- |
| GitHub REST API | Fetch candidate profile data |

### Data Extracted

* Repositories
* Commits
* Programming languages
* Contribution activity

---

## 🧰 7. Development Tools

| Tool               | Purpose            |
| ------------------ | ------------------ |
| Visual Studio Code | Code editor        |
| Git                | Version control    |
| GitHub             | Code hosting       |
| Postman            | API testing        |
| npm                | Package management |

---

## 🔒 8. Security Considerations

* Validation of uploaded files (PDF/DOCX)
* Secure handling of API requests
* Environment variables for sensitive data
* Handling GitHub API rate limits

---

## 📊 9. Architecture Summary

* **Frontend:** User interaction and input handling
* **Backend (Node.js):** Core processing and logic
* **Database:** Storage of candidate data
* **API Layer:** GitHub integration

---

## 🔄 10. Data Flow Summary

1. Recruiter uploads resumes and provides GitHub links
2. Backend processes resume text
3. ATS score is calculated using NLP techniques
4. GitHub data is fetched via API
5. GitHub score is computed
6. Final score and ranking are generated
7. Results are displayed on the frontend

---

## 📈 11. Future Enhancements

* Advanced NLP models for better semantic matching
* Improved scoring algorithms
* Enhanced dashboard UI
* Support for additional platforms (e.g., LinkedIn)

---

## 🧾 12. Conclusion

The project is built using a Node.js-centric tech stack, enabling efficient backend processing, API integration, and scalable system design. The chosen technologies ensure a balance between performance, simplicity, and real-world applicability.

---
