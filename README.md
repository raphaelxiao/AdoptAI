# AdoptAI - AI任务参与度评估器

<div align="center">

![AdoptAI Logo](https://img.shields.io/badge/AdoptAI-智能协作决策-4285f4?style=for-the-badge&logo=robot&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/yourusername/AdoptAI?style=flat-square)](https://github.com/yourusername/AdoptAI)

**智能决策AI在任务中的参与程度，科学规划人机协作模式**

[在线体验](https://your-demo-url.com) • [使用文档](#使用指南) • [API文档](#api-接口) • [贡献指南](#贡献)

</div>

## 🎯 项目简介

AdoptAI是一个智能的AI任务参与度评估工具，帮助您科学决策在完成任务时AI应该扮演什么角色。基于您提供的任务描述、职业背景和年龄，系统会从四个维度评估每项所需能力，并给出个性化的AI协作建议。

### ✨ 核心特性

- 🧠 **智能任务分析**：AI自动拆解任务所需的核心能力
- 📊 **四维度评估**：从能力发展程度、应用时间、持续性、相关度四个维度科学评估
- 🤖 **AI角色建议**：基于评估结果推荐最适合的AI协作模式（下属/导师/工具/同事/自主）
- 🔄 **多模型支持**：支持OpenAI、DeepSeek、SiliconFlow、阿里云等多种AI服务
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🎨 **现代化UI**：Google Material Design风格，简洁美观

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- 任意一种AI服务的API密钥

### 安装部署

1. **克隆项目**
```bash
git clone https://github.com/yourusername/AdoptAI.git
cd AdoptAI
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp env.example .env
```

编辑`.env`文件，配置AI服务：

```env
# 推荐配置（国内用户）
AI_MODEL=Pro/deepseek-ai/DeepSeek-V3
SILICONFLOW_API_KEY=your_siliconflow_api_key

# 或使用OpenAI
AI_MODEL=gpt-4o
OPENAI_API_KEY=your_openai_api_key

# 可选：代理配置（中国大陆用户）
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
```

4. **测试配置**
```bash
npm test
```

5. **启动应用**
```bash
npm start
```

6. **访问应用**
打开浏览器访问：`http://localhost:3000`

## 📱 使用指南

### 评估流程

1. **输入任务信息**
   - 详细描述要完成的任务
   - 填写当前职业
   - 输入年龄和能力应用截止年龄

2. **查看能力分析**
   - AI自动分析任务所需的3-5项核心能力

3. **评估能力水平**
   - 通过滑块选择每项能力的当前水平
   - 从初学者到专家五个等级

4. **获取AI建议**
   - 查看四维度评估结果
   - 获得个性化的AI协作建议

### 评估维度详解

| 维度 | 说明 | 评分逻辑 |
|------|------|----------|
| **能力发展程度** | 继续提升该能力的边际效益 | 初学者得分高，专家得分低 |
| **能力应用时间** | 该能力未来的应用时间长度 | 年轻用户得分高，年龄大得分低 |
| **能力持续性** | 被AI等技术替代的概率（逆向） | 创造性能力得分高，重复性得分低 |
| **能力相关度** | 与职业发展的相关程度 | 核心专业技能得分高，辅助技能得分低 |

### AI角色说明

| 角色 | 总分范围 | 建议行动 | 典型场景 |
|------|----------|----------|----------|
| **下属** | ≤15分 | 直接让AI代劳 | 基础数据整理、格式调整 |
| **导师** | 16-25分，应用时间长 | 让AI指导学习 | 新技能学习、专业提升 |
| **工具** | 16-25分，持续性低 | 将AI作为工具使用 | 数据分析、报告生成 |
| **同事** | 16-25分，相关度低 | 与AI协作完成 | 跨领域协作、辅助工作 |
| **自主** | ≥26分 | 建议自己完成 | 核心专业技能、战略决策 |

## 🔧 配置说明

### 支持的AI服务

| 服务商 | 模型 | 推荐指数 | 备注 |
|--------|------|----------|------|
| **SiliconFlow** | Pro/deepseek-ai/DeepSeek-V3 | ⭐⭐⭐⭐⭐ | 国内访问稳定，推荐 |
| **DeepSeek** | deepseek-chat, deepseek-reasoner | ⭐⭐⭐⭐ | 国内服务，性价比高 |
| **OpenAI** | gpt-4o, gpt-4o-mini | ⭐⭐⭐ | 需要代理，质量高 |
| **阿里云** | deepseek-v3 | ⭐⭐⭐ | 企业用户推荐 |

### API密钥获取

- **SiliconFlow**：https://siliconflow.cn/
- **DeepSeek**：https://platform.deepseek.com/
- **OpenAI**：https://platform.openai.com/
- **阿里云**：https://dashscope.aliyuncs.com/

## 🏗️ 项目结构

```
AdoptAI/
├── config/
│   └── models.js          # AI模型配置
├── public/
│   ├── index.html         # 主页面
│   ├── styles.css         # 样式文件
│   ├── script.js          # 前端逻辑
│   └── qr.jpg            # 联系二维码
├── routes/
│   └── api.js            # API路由
├── utils/
│   └── filter.js         # 敏感词过滤
├── server.js             # 服务器入口
├── package.json          # 项目配置
├── filter.txt            # 敏感词列表
└── README.md             # 项目文档
```

## 🔌 API接口

### 任务分析
```http
POST /api/analyze-task
Content-Type: application/json

{
  "task": "写一份市场分析报告",
  "profession": "产品经理",
  "age": 28,
  "retirementAge": 60
}
```

### 能力评估
```http
POST /api/evaluate-skill
Content-Type: application/json

{
  "skill": "数据分析",
  "userLevel": "中级：比较熟练，能独立完成大部分任务",
  "task": "写一份市场分析报告",
  "profession": "产品经理",
  "age": 28,
  "retirementAge": 60,
  "durationScore": 8
}
```

### 获取建议
```http
POST /api/get-recommendation
Content-Type: application/json

{
  "evaluations": [...],
  "task": "写一份市场分析报告",
  "profession": "产品经理",
  "age": 28,
  "retirementAge": 60
}
```

## 🛠️ 开发指南

### 本地开发

```bash
# 开发模式启动
npm run dev

# 代码格式化
npm run format

# 运行测试
npm test
```

### 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `AI_MODEL` | AI模型名称 | `gpt-4o` |
| `OPENAI_API_KEY` | OpenAI API密钥 | `sk-...` |
| `DEEPSEEK_API_KEY` | DeepSeek API密钥 | `sk-...` |
| `SILICONFLOW_API_KEY` | SiliconFlow API密钥 | `sk-...` |
| `DASHSCOPE_API_KEY` | 阿里云API密钥 | `sk-...` |
| `HTTP_PROXY` | HTTP代理 | `http://127.0.0.1:7890` |
| `HTTPS_PROXY` | HTTPS代理 | `http://127.0.0.1:7890` |
| `PORT` | 服务端口 | `3000` |

## 📋 更新日志

### v2.0.0 - 多模型支持版本

#### 🚀 新功能
- **多AI服务提供商支持**：支持OpenAI、DeepSeek、SiliconFlow、阿里云等
- **智能备选模型**：主模型不可用时自动切换备选模型
- **敏感词过滤**：前后端双重敏感词检查机制
- **移动端优化**：完善的响应式设计和折叠功能

#### 🎨 UI优化
- **Google蓝配色**：采用现代化的Google Material Design配色
- **滑块交互**：直观的拖拽式能力评估界面
- **进度显示**：实时显示AI分析进度
- **折叠卡片**：移动端友好的折叠式结果展示

#### 🔧 技术改进
- **统一客户端管理**：`config/models.js`统一管理AI服务配置
- **错误处理优化**：完善的错误处理和用户提示
- **代理支持**：完整的HTTP/HTTPS代理支持

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献指南

- 遵循现有的代码风格
- 添加适当的注释
- 更新相关文档
- 确保所有测试通过

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [OpenAI](https://openai.com/) - 提供强大的AI模型
- [DeepSeek](https://deepseek.com/) - 优秀的国产AI模型
- [SiliconFlow](https://siliconflow.cn/) - 稳定的AI服务平台
- [Express.js](https://expressjs.com/) - 快速的Node.js Web框架

## 📞 联系我们

- 项目主页：https://github.com/yourusername/AdoptAI
- 问题反馈：https://github.com/yourusername/AdoptAI/issues
- 邮箱：your-email@example.com

---

<div align="center">

**如果这个项目对您有帮助，请给我们一个 ⭐ Star！**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div> 