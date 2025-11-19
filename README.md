# 🏥 MedInfo-AI: 智能体检报告解读助手 (MVP)

> 基于 LLM (Large Language Model) 的个人健康数据解读工具，致力于解决医疗信息不对称与体检报告“难读懂”的痛点。

## 🌟 项目背景
作为医学信息工程专业的学生，我发现普通用户面对体检报告中的专业术语（如“窦性心律不齐”、“ALT偏高”）时常产生不必要的恐慌。本项目利用 RAG（检索增强生成）思想与 Prompt Engineering，将晦涩的医疗数据转化为通俗易懂的生活化建议。

## ⚡️ 核心功能
- **📷 结构化提取**：支持将复杂的非结构化文本转化为可视化的关键指标卡片。
- **🛡️ 隐私与合规**：前端 PII (个人敏感信息) 脱敏处理，强制植入医疗免责声明。
- **🧠 幻觉抑制**：通过 System Prompt 优化，有效识别“生理性异常”与“病理性异常”，避免过度医疗建议。

## 🛠️ 技术栈
- **Frontend/Backend**: Python, Streamlit
- **AI Core**: OpenAI API / DeepSeek (兼容 OpenAI 格式)
- **Deployment**: Streamlit Community Cloud

## 🚀 快速开始
1. Clone 本项目
   ```bash
   git clone https://github.com/fd44fdg/medinfo.git

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
<img width="450" height="865" alt="QQ20251119-172514" src="https://github.com/user-attachments/assets/49543f0c-f45c-47ff-b446-a576fe0b5b09" />
<img width="450" height="860" alt="QQ20251119-172531" src="https://github.com/user-attachments/assets/489921d7-94ee-4969-829f-f54dd5106135" />
