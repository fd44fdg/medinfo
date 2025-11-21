[MedInfo-AI.md](https://github.com/user-attachments/files/23670284/MedInfo-AI.md)
# 🏥 MedInfo-AI: Intelligent Medical Checkup Report Interpretation Assistant (MVP)

> A personal health data interpretation tool based on LLM (Large Language Model), dedicated to addressing the pain points of medical information asymmetry and the "difficulty in understanding" medical checkup reports.

## 🌟 Project Background

As a student majoring in Medical Information Engineering, I found that ordinary users often experience unnecessary panic when faced with professional terms in medical checkup reports (such as "sinus arrhythmia" and "elevated ALT"). This project utilizes the concept of RAG (Retrieval-Augmented Generation) and Prompt Engineering to transform obscure medical data into easy-to-understand, daily-life advice.

## ⚡️ Core Features



* **📷 Structured Extraction**: Supports converting complex unstructured text into visualized key indicator cards.

* **🛡️ Privacy and Compliance**: Frontend PII (Personally Identifiable Information) desensitization processing, mandatory implantation of medical disclaimers.

* **🧠 Hallucination Suppression**: Through System Prompt optimization, effectively identifies "physiological abnormalities" and "pathological abnormalities" to avoid excessive medical advice.

## 🛠️ Tech Stack



* **Frontend/Backend**: Python, Streamlit

* **AI Core**: OpenAI API / DeepSeek (compatible with OpenAI format)

* **Deployment**: Streamlit Community Cloud

## 🚀 Quick Start



1. Clone this project



```
git clone https://github.com/fd44fdg/medinfo.git
```

## Run Locally

**Prerequisites:**  Node.js



1. Install dependencies:

   `npm install`

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:

   `npm run dev`

<img width="450" height="865" alt="QQ20251119-172514" src="https://github.com/user-attachments/assets/49543f0c-f45c-47ff-b446-a576fe0b5b09" />
<img width="450" height="860" alt="QQ20251119-172531" src="https://github.com/user-attachments/assets/489921d7-94ee-4969-829f-f54dd5106135" />

> （注：文档部分内容可能由 AI 生成）
