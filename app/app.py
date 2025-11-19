import streamlit as st
import google.generativeai as genai
from PIL import Image
import json

# 页面配置
st.set_page_config(
    page_title="MedInfo-AI | 智能体检报告解读助手",
    page_icon="🩺",
    layout="wide"
)

# 侧边栏：API Key
with st.sidebar:
    st.header("设置")
    api_key = st.text_input("请输入 Google API Key", type="password")
    st.info("您的 Key 仅用于本次会话，不会被存储。")

# 主界面
st.title("🩺 智能体检报告解读助手 (MedInfo-AI)")
st.markdown("### 就像问老朋友一样简单，AI 帮您读懂体检报告")

# 输入区域
col1, col2 = st.columns([1, 1])

with col1:
    st.subheader("1. 输入或上传")
    input_text = st.text_area("直接粘贴报告内容（异常项）：", height=150, placeholder="例如：窦性心律不齐，谷丙转氨酶 65 U/L...")
    uploaded_file = st.file_uploader("或者上传报告照片", type=["jpg", "jpeg", "png"])
    
    image_data = None
    if uploaded_file:
        image = Image.open(uploaded_file)
        st.image(image, caption="已上传报告", use_column_width=True)
        image_data = image

with col2:
    st.subheader("2. 解读结果")
    analyze_btn = st.button("开始解读", type="primary", use_container_width=True)

    if analyze_btn:
        if not api_key:
            st.error("请先在左侧边栏输入 API Key")
        elif not input_text and not uploaded_file:
            st.warning("请输入文字或上传图片")
        else:
            try:
                with st.spinner("AI 正在像老专家一样仔细分析..."):
                    # 配置 Gemini
                    genai.configure(api_key=api_key)
                    # 使用 gemini-2.5-flash 或 1.5-pro
                    model = genai.GenerativeModel('gemini-2.5-flash')
                    
                    prompt = """
                    你现在是一位经验丰富、和蔼可亲的老医生。
                    请分析用户的体检报告（文本或图片）。
                    
                    请返回纯 JSON 格式，不要包含 Markdown 标记（如 ```json）。
                    JSON 结构如下：
                    {
                        "summary": "用通俗易懂、像聊天一样的语气总结。解释是什么，严重吗，给点生活建议。",
                        "indicators": [
                            {"name": "指标名称", "value": "数值", "unit": "单位", "status": "Normal/Warning/Critical", "interpretation": "一句话简评"}
                        ]
                    }
                    """
                    
                    inputs = [prompt]
                    if input_text:
                        inputs.append(f"报告文本内容：{input_text}")
                    if image_data:
                        inputs.append(image_data)
                        
                    response = model.generate_content(inputs)
                    
                    # 简单解析 JSON (实际生产中需更严谨)
                    text_resp = response.text.strip()
                    if text_resp.startswith("```json"):
                        text_resp = text_resp[7:-3]
                    
                    data = json.loads(text_resp)
                    
                    # 显示结果
                    st.success("解读完成！")
                    
                    # 渲染可视化卡片
                    st.markdown("#### 📊 关键指标")
                    cols = st.columns(3)
                    for idx, item in enumerate(data.get("indicators", [])):
                        with cols[idx % 3]:
                            color = "green" if item['status'] == 'Normal' else "orange" if item['status'] == 'Warning' else "red"
                            st.metric(
                                label=item['name'], 
                                value=f"{item['value']} {item['unit']}",
                                delta=item['interpretation'],
                                delta_color="inverse" if item['status'] != 'Normal' else "normal"
                            )
                            if item['status'] != 'Normal':
                                st.caption(f"⚠️ {item['status']}")
                    
                    st.divider()
                    
                    # 渲染文字解读
                    st.markdown("#### 💡 医生建议")
                    st.info(data.get("summary", "解析失败"))

            except Exception as e:
                st.error(f"发生错误: {str(e)}")
