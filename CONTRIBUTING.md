# 贡献指南

感谢您对 AdoptAI 项目的关注！我们欢迎所有形式的贡献。

## 🤝 如何贡献

### 报告问题

如果您发现了 bug 或有功能建议，请：

1. 检查 [Issues](https://github.com/raphaelxiao/AdoptAI/issues) 确认问题未被报告
2. 创建新的 Issue，详细描述问题或建议
3. 提供复现步骤（如果是 bug）

### 提交代码

1. **Fork 项目**
   ```bash
   git clone https://github.com/raphaelxiao/AdoptAI.git
   cd AdoptAI
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **开发和测试**
   ```bash
   npm install
   npm test
   npm start
   ```

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**

## 📝 代码规范

### 提交信息格式

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

### 代码风格

- 使用 2 个空格缩进
- 使用分号结尾
- 变量和函数使用驼峰命名
- 常量使用大写下划线命名
- 添加适当的注释

### 文件结构

```
AdoptAI/
├── config/          # 配置文件
├── public/          # 前端静态文件
├── routes/          # API 路由
├── utils/           # 工具函数
├── tests/           # 测试文件
└── docs/            # 文档
```

## 🧪 测试

在提交 PR 前，请确保：

- [ ] 所有现有测试通过
- [ ] 新功能有对应的测试
- [ ] 代码覆盖率不降低
- [ ] 手动测试功能正常

```bash
npm test
npm start  # 手动测试
```

## 📚 开发环境

### 必需软件

- Node.js 18+
- npm 8+
- Git

### 推荐工具

- VS Code
- Postman（API 测试）
- Chrome DevTools

### 环境配置

1. 复制环境变量文件：
   ```bash
   cp env.example .env
   ```

2. 配置 AI 服务密钥（至少一个）：
   ```env
   AI_MODEL=Pro/deepseek-ai/DeepSeek-V3
   SILICONFLOW_API_KEY=your_key
   ```

## 🎯 开发重点

### 当前优先级

1. **性能优化**：减少 API 调用时间
2. **用户体验**：改进 UI/UX
3. **多语言支持**：国际化
4. **移动端优化**：响应式设计改进

### 技术债务

- [ ] 添加单元测试
- [ ] 优化错误处理
- [ ] 改进日志系统
- [ ] 添加性能监控

## 🔍 代码审查

所有 PR 都需要经过代码审查：

- 功能是否符合需求
- 代码质量和可读性
- 测试覆盖率
- 文档是否更新
- 性能影响评估

## 📞 联系方式

如有疑问，可以通过以下方式联系：

- GitHub Issues
- 邮箱：your-email@example.com
- 微信群：扫描项目中的二维码

## 🙏 致谢

感谢所有贡献者的努力！您的贡献让 AdoptAI 变得更好。

---

再次感谢您的贡献！🎉 