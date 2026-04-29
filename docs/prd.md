# 📄 Product Requirements Document (PRD)

## 🧩 Product Name

**GitVerify – Intelligent Resume Screening & GitHub Validation System**

---

## 🎯 1. Problem Statement

In modern recruitment processes, recruiters receive a large number of resumes, making it difficult to:

* Identify the most suitable candidates efficiently
* Verify the authenticity of skills mentioned in resumes
* Filter out candidates with exaggerated or false claims

Traditional ATS (Applicant Tracking Systems) rely heavily on keyword matching, which often leads to inaccurate shortlisting.

---

## 💡 2. Solution Overview

GitVerify is a full-stack web application that automates candidate evaluation by combining:

* **ATS-based resume scoring (ML-powered)**
* **GitHub profile verification**
* **Final candidate ranking system**

The platform helps recruiters make **data-driven, reliable, and efficient hiring decisions**.

---

## 👥 3. Target Users

* Recruiters / HR teams
* Hiring managers
* Startups and tech companies

---

## 🚀 4. Goals & Objectives

### Primary Goals

* Automate resume screening
* Improve hiring accuracy
* Detect false claims using GitHub verification

### Secondary Goals

* Provide transparent scoring
* Reduce recruiter workload
* Enable faster candidate shortlisting

---

## ⚙️ 5. Core Features

### 5.1 Resume Upload & Processing

* Upload multiple resumes (PDF/DOCX)
* Extract and preprocess text

### 5.2 ATS Scoring (ML-Based)

* TF-IDF vectorization
* Embedding-based similarity
* Cosine similarity calculation
* Score resumes against job description

### 5.3 GitHub Profile Analysis

* Fetch data using GitHub API
* Analyze:

  * Repositories
  * Commits
  * Programming languages
  * Contribution activity

### 5.4 Claim Verification

* Compare resume skills vs GitHub activity
* Detect inconsistencies
* Flag suspicious profiles

### 5.5 Candidate Ranking System

* Combine ATS score + GitHub score
* Generate ranked list
* Highlight top candidates

### 5.6 Dashboard (Frontend)

* Display:

  * Scores
  * Rankings
  * Flags
* Simple and intuitive UI

---

## 🧠 6. Technical Approach

### ATS Scoring

* NLP preprocessing (tokenization, stop-word removal)
* TF-IDF + vector embeddings
* Cosine similarity

### GitHub Scoring

* Activity-based scoring
* Language relevance
* Repository quality
* Consistency analysis

### Final Score

* Weighted combination of ATS + GitHub score

---

## 🏗️ 7. System Architecture

### Components

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **External API:** GitHub API

### Flow

1. Input resumes + GitHub links + job description
2. Resume parsing
3. ATS scoring
4. GitHub data extraction
5. Scoring & validation
6. Ranking output

---

## 📊 8. Functional Requirements

* Upload and process resumes
* Accept job description input
* Fetch GitHub data via API
* Compute ATS score
* Compute GitHub score
* Generate candidate ranking
* Display results on dashboard

---

## 🔒 9. Non-Functional Requirements

* Performance: Handle multiple resumes efficiently
* Scalability: Support increasing number of users
* Reliability: Accurate scoring system
* Usability: Simple UI/UX
* Security: Safe handling of user data

---

## ⚠️ 10. Assumptions & Constraints

### Assumptions

* Candidates provide valid GitHub profiles
* Resumes are readable (PDF/DOCX)

### Constraints

* GitHub API rate limits
* Variability in resume formats
* Limited access to private repositories

---

## 🧪 11. Testing Strategy

* Unit testing (modules)
* API testing (GitHub integration)
* Integration testing
* Sample resume validation

---

## 📦 12. Deliverables

* Functional web application
* Backend APIs
* Resume parsing module
* GitHub analysis module
* Candidate ranking system
* Documentation

---

## 📅 13. Future Enhancements

* AI-based resume summarization
* Support for LinkedIn verification
* Advanced ML models (BERT, transformers)
* Real-time analytics dashboard
* Recruiter feedback loop for model improvement

---

## 📈 14. Success Metrics

* Accuracy of candidate ranking
* Reduction in recruiter screening time
* Detection rate of false claims
* User satisfaction

---

## 🧾 15. Conclusion

GitVerify aims to revolutionize the recruitment process by combining intelligent resume analysis with real-world validation using GitHub data. The system provides a reliable, scalable, and efficient solution for modern hiring challenges.

---
