# 📄 **PROJECT REPORT**

---

## **Project Title**

**GitVerify: Intelligent Resume Screening and GitHub-Based Candidate Validation System**



## **Project Abstract (2 pts)**

GitVerify is a full-stack web application designed to enhance the efficiency and reliability of the recruitment process. In modern hiring workflows, recruiters receive a large number of resumes, making it difficult to verify the authenticity of candidate claims and identify the most suitable applicants.

The proposed system addresses this challenge by combining resume analysis with GitHub profile verification. The system accepts resumes, GitHub profile links, and a job description as input. It computes an ATS (Applicant Tracking System) score using Natural Language Processing techniques to evaluate how well each resume matches the job requirements.

Additionally, GitVerify analyzes the candidate’s GitHub profile using API-based data extraction. It evaluates repository activity, programming language usage, contribution consistency, and project quality to verify whether the claims made in the resume are genuine.

Finally, the system combines ATS and GitHub scores to generate a ranked list of candidates. It also flags inconsistencies, enabling recruiters to make informed and data-driven hiring decisions.

---

## **Updated Project Approach and Architecture (2 pts)**

The system follows a full-stack architecture using Node.js and Express.js for backend development and a web-based frontend interface.

The workflow begins with recruiters uploading resumes, GitHub profile links, and a job description. The backend processes resumes using NLP techniques such as tokenization, stop-word removal, and vectorization.

ATS scoring is performed using TF-IDF and embedding-based approaches, followed by cosine similarity to measure relevance. For GitHub verification, the system integrates with the GitHub API to extract repository data, commit history, and programming languages.

The backend exposes RESTful APIs for communication with the frontend. A scoring engine combines ATS and GitHub scores to generate final rankings. MongoDB (or similar database) is used to store candidate data and results.

The frontend dashboard displays candidate scores, rankings, and verification flags in a user-friendly format.

---

## **ATS Scoring Model (ML-Based)**

The ATS scoring system uses Natural Language Processing and Machine Learning techniques to evaluate resume relevance.

### **TF-IDF Representation**

TF\text{-}IDF(t,d)=TF(t,d)\times \log\left(\frac{N}{DF(t)}\right)

This method assigns importance to terms based on their frequency and uniqueness.

---

### **Cosine Similarity**

\text{Cosine Similarity} = \frac{A \cdot B}{|A||B|}

This computes similarity between resume and job description vectors.

---

### **Final ATS Score**

[
\text{ATS Score} = \alpha \cdot S_{TF-IDF} + \beta \cdot S_{Embedding}
]

Where semantic embeddings capture contextual similarity beyond keywords.

---

## **GitHub Scoring and Verification Model**

GitVerify evaluates candidate authenticity using GitHub activity.

### **Activity Score**

[
S_{activity} = \frac{\text{Total Commits + Recent Commits}}{\text{Time Period}}
]

### **Language Relevance**

[
S_{lang} = \frac{\text{Matching Languages}}{\text{Required Languages}}
]

### **Repository Quality**

[
S_{quality} = w_1 \cdot \text{Stars} + w_2 \cdot \text{Forks} + w_3 \cdot \text{Projects}
]

### **Consistency Score**

[
S_{consistency} = \frac{\text{Active Days}}{\text{Total Days}}
]

### **Verification Score**

[
S_{verification} = \frac{\text{Verified Skills}}{\text{Claimed Skills}}
]

---

### **Final GitHub Score**

[
\text{GitHub Score} = \alpha S_{activity} + \beta S_{lang} + \gamma S_{quality} + \delta S_{consistency} + \epsilon S_{verification}
]

---

### **Final Candidate Ranking**

[
\text{Final Score} = \lambda \cdot \text{ATS Score} + (1 - \lambda) \cdot \text{GitHub Score}
]

---

## **System Architecture Diagram**


![Image](https://www.researchgate.net/profile/Ankita-Tidake-2/publication/382099903/figure/fig1/AS%3A11431281259572318%401720536630486/System-architecture-of-ATS_Q320.jpg)

![Image](https://raw.githubusercontent.com/afteracademy/nodejs-backend-architecture-typescript/main/addons/github_assets/api-structure.png)

![Image](https://miro.medium.com/0%2ARfvInMt7Z1TSCa8N)

**Figure 1: System Architecture of GitVerify**

The system consists of frontend, backend, GitHub API integration, resume processing module, scoring engine, and database.

---

## **System Flowchart**

![Image](https://miro.medium.com/1%2A2PwCHmLx_zF3UV7txmnpCw.png)

![Image](https://www.researchgate.net/publication/378829570/figure/fig2/AS%3A11431281367143153%401744255191969/Flowchart-of-proposed-automated-resume-screening-and-candidate-ranking-mechanism.png)

![Image](https://www.mdpi.com/electronics/electronics-14-04960/article_deploy/html/images/electronics-14-04960-g001-550.jpg)

![Image](https://www.researchgate.net/publication/378829570/figure/fig1/AS%3A11431281367152394%401744255191452/Proposed-mechanism-for-automated-resume-screening_Q320.jpg)

**Figure 2: Workflow of Candidate Evaluation Process**

---

## **Tasks Completed (7 pts)**

| Task Completed                          | Team Member |
| --------------------------------------- | ----------- |
| Problem analysis and research           | Team Lead   |
| System design and architecture planning | Team Lead   |
| Backend setup (Node.js + Express)       | Team Lead   |
| Resume parsing implementation           | Team Lead   |
| GitHub API integration                  | Team Lead   |
| Initial ATS scoring model               | Team Lead   |

---

## **Challenges/Roadblocks (7 pts)**

The primary challenge was handling unstructured resume data in multiple formats such as PDF and DOCX. Extracting meaningful structured information required robust parsing techniques.

Another challenge was designing an accurate ATS scoring model. Basic keyword matching was insufficient, leading to the adoption of TF-IDF and embedding-based approaches.

GitHub API integration also presented challenges such as rate limits and interpreting repository data effectively. Ensuring fair evaluation of candidate skills required combining multiple scoring factors.

These challenges are being addressed through improved parsing libraries, optimized scoring algorithms, and efficient API usage strategies.

---

## **Tasks Pending (7 pts)**

| Task Pending                     | Team Member |
| -------------------------------- | ----------- |
| Improve ML scoring weights       | Team Lead   |
| Advanced GitHub validation logic | Team Lead   |
| Frontend dashboard development   | Team Lead   |
| Database integration (MongoDB)   | Team Lead   |
| Testing and debugging            | Team Lead   |

---

## **Project Outcome/Deliverables (2 pts)**

The final deliverable will be a web application that automates resume screening and validates candidate claims using GitHub data. It will provide ATS scores, GitHub scores, and a ranked list of candidates.

The system will help recruiters identify genuine candidates efficiently and reduce hiring errors.

---

## **Progress Overview (2 pts)**

The project is approximately 60–70% complete. Core backend functionalities such as resume parsing and GitHub data extraction are implemented.

Scoring models are partially completed, while frontend and integration tasks are in progress. The project is progressing steadily with minor delays in UI development.

---

## **Codebase Information (2 pts)**

Repository Link: (Add your GitHub repo)
Branch: main

The repository contains backend implementation, API integration, and scoring logic. Major commits include project setup, parsing module, and GitHub API integration.

---

## **Testing and Validation Status (2 pts)**

| Test Type           | Status      | Notes                      |
| ------------------- | ----------- | -------------------------- |
| Resume Parsing      | Pass        | Works for standard formats |
| GitHub API          | Pass        | Data fetched successfully  |
| ATS Scoring         | In Progress | Needs tuning               |
| Integration Testing | Pending     | Yet to be done             |

---

## **Deliverables Progress (2 pts)**

Backend modules for resume parsing and GitHub analysis are completed. ATS scoring is partially implemented, while frontend dashboard and ranking system are under development.

Overall system integration and final testing remain pending.

---

# 🔥 FINAL TIP (for viva)

If they ask:
**“What is innovative in your project?”**

Say:

> “Our system not only evaluates resumes using ML-based ATS scoring but also verifies candidate authenticity through GitHub activity analysis, making the hiring process both intelligent and trustworthy.”

