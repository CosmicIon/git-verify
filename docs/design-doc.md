# 🏗️ System Design Document

## 📌 Project Name

**GitVerify – Intelligent Resume Screening & GitHub Validation System**

---

## 🧩 1. Overview

This document describes the system design, architecture, components, database schema, and API structure of GitVerify. The system is designed to automate resume screening and validate candidate claims using GitHub data.

---

## 🎯 2. System Objectives

* Automate resume evaluation using NLP techniques
* Verify candidate skills using GitHub activity
* Rank candidates based on combined scoring
* Provide a scalable and modular backend system

---

## 🏛️ 3. High-Level Architecture

### Components

* **Frontend:** User interface for input and results
* **Backend (Node.js + Express):** Core logic and APIs
* **Database (MongoDB):** Data storage
* **External API:** GitHub API

### Workflow

1. User uploads resumes and GitHub links
2. Backend processes resumes
3. ATS score is computed
4. GitHub data is fetched
5. GitHub score is calculated
6. Final score and ranking are generated
7. Results are displayed

---

## ⚙️ 4. System Components

### 4.1 Resume Processing Module

* Extract text from PDF/DOCX
* Perform preprocessing:

  * Tokenization
  * Stop-word removal
  * Normalization

---

### 4.2 ATS Scoring Engine

* TF-IDF vectorization
* Embedding-based similarity
* Cosine similarity calculation
* Output: ATS score

---

### 4.3 GitHub Analysis Module

* Fetch data using GitHub API
* Analyze:

  * Repositories
  * Commits
  * Languages
  * Contribution activity

---

### 4.4 Scoring Engine

* Combine ATS score and GitHub score
* Apply weighted formula
* Generate final score

---

### 4.5 Ranking Module

* Sort candidates based on final score
* Assign ranks
* Flag inconsistencies

---

### 4.6 API Layer

* RESTful APIs for communication
* Handles all client-server interactions

---

## 🗄️ 5. Database Design (MongoDB)

### Collection: **candidates**

```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "resumeText": "string",
  "githubUsername": "string",
  "atsScore": "number",
  "githubScore": "number",
  "finalScore": "number",
  "rank": "number",
  "flags": ["string"],
  "createdAt": "date"
}
```

---

### Collection: **jobs**

```json
{
  "_id": "ObjectId",
  "jobDescription": "string",
  "requiredSkills": ["string"],
  "createdAt": "date"
}
```

---

## 🔌 6. API Design

### 6.1 Upload Resume

**POST** `/api/upload`

**Description:** Upload resumes and GitHub links

**Request:**

```json
{
  "resume": "file",
  "githubLink": "string"
}
```

**Response:**

```json
{
  "message": "Upload successful"
}
```

---

### 6.2 Calculate Scores

**POST** `/api/score`

**Description:** Compute ATS and GitHub scores

**Response:**

```json
{
  "atsScore": 0.78,
  "githubScore": 0.65,
  "finalScore": 0.72
}
```

---

### 6.3 Get Rankings

**GET** `/api/rankings`

**Description:** Retrieve ranked candidates

**Response:**

```json
[
  {
    "name": "Candidate A",
    "finalScore": 0.85,
    "rank": 1
  }
]
```

---

## 🔄 7. Data Flow Diagram (Textual)

1. Input resumes + GitHub links
2. Resume parsing → cleaned text
3. ATS scoring (TF-IDF + similarity)
4. GitHub API fetch → profile data
5. GitHub scoring calculation
6. Combine scores → final score
7. Store in database
8. Display rankings

---

## 📊 8. Scoring Flow

* Resume → Vectorization → Similarity → ATS Score
* GitHub → Activity Analysis → GitHub Score
* Combined → Final Score → Ranking

---

## ⚠️ 9. Error Handling

* Invalid file format → reject upload
* Missing GitHub profile → flag candidate
* API failure → retry mechanism
* Empty resume → return error

---

## 🔒 10. Security Design

* Input validation for uploads
* Secure API endpoints
* Use environment variables for secrets
* Limit API request rates

---

## 📈 11. Scalability Considerations

* Modular architecture
* API-based design
* Database indexing
* Ability to scale backend services

---

## 🧪 12. Testing Strategy

* Unit testing (modules)
* API testing (Postman)
* Integration testing
* Sample dataset validation

---

## 🧾 13. Future Improvements

* Advanced ML models (BERT)
* Real-time processing
* Microservices architecture
* Enhanced UI dashboard

---

## ✅ 14. Conclusion

The system design of GitVerify ensures modularity, scalability, and efficient processing of candidate data. The integration of NLP techniques and GitHub validation makes it a robust solution for modern recruitment challenges.

---
