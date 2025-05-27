const express = require('express');
const router = express.Router();
const { modelConfig, tryWithBackupModels } = require('../config/models');
const filter = require('../utils/filter');

// 清理LLM返回内容中的markdown标记
function cleanJsonResponse(content) {
    // 移除markdown代码块标记
    let cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // 移除可能的前后空白
    cleaned = cleaned.trim();
    
    // 如果内容以非JSON字符开头，尝试找到第一个{或[
    const jsonStart = cleaned.search(/[{\[]/);
    if (jsonStart > 0) {
        cleaned = cleaned.substring(jsonStart);
    }
    
    // 如果内容以非JSON字符结尾，尝试找到最后一个}或]
    const jsonEnd = cleaned.lastIndexOf('}') !== -1 ? cleaned.lastIndexOf('}') + 1 : 
                   cleaned.lastIndexOf(']') !== -1 ? cleaned.lastIndexOf(']') + 1 : cleaned.length;
    if (jsonEnd < cleaned.length) {
        cleaned = cleaned.substring(0, jsonEnd);
    }
    
    return cleaned;
}

// 任务分析API
router.post('/analyze-task', async (req, res) => {
    try {
        const { task, profession, age } = req.body;

        if (!task || !profession || !age) {
            return res.status(400).json({
                error: '缺少必要参数',
                message: '请提供任务描述、职业和年龄信息'
            });
        }

        // 敏感词过滤检查
        const taskValidation = filter.validateInput(task, '任务描述');
        if (!taskValidation.valid) {
            return res.status(400).json({
                error: '内容不符合规范',
                message: taskValidation.message
            });
        }

        const professionValidation = filter.validateInput(profession, '职业');
        if (!professionValidation.valid) {
            return res.status(400).json({
                error: '内容不符合规范',
                message: professionValidation.message
            });
        }

        // 第一步：拆解任务能力
        const skillsAnalysis = await analyzeTaskSkills(task, profession, age);
        
        res.json({
            success: true,
            data: {
                task,
                profession,
                age,
                analysis: skillsAnalysis
            }
        });

    } catch (error) {
        console.error('任务分析错误:', error);
        res.status(500).json({
            error: '分析失败',
            message: error.message
        });
    }
});

// 能力评估API
router.post('/evaluate-skill', async (req, res) => {
    try {
        const { skill, userLevel, task, profession, age, retirementAge, durationScore } = req.body;

        if (!skill || !userLevel || !task || !profession || !age || !retirementAge || durationScore === undefined) {
            return res.status(400).json({
                error: '缺少必要参数'
            });
        }

        const evaluation = await evaluateSkill(skill, userLevel, task, profession, age, retirementAge, durationScore);
        
        res.json({
            success: true,
            data: evaluation
        });

    } catch (error) {
        console.error('能力评估错误:', error);
        res.status(500).json({
            error: '评估失败',
            message: error.message
        });
    }
});

// 最终建议API
router.post('/get-recommendation', async (req, res) => {
    try {
        const { evaluations, task, profession, age } = req.body;

        if (!evaluations || !task || !profession || !age) {
            return res.status(400).json({
                error: '缺少必要参数'
            });
        }

        const recommendation = await generateRecommendation(evaluations, task, profession, age);
        
        res.json({
            success: true,
            data: recommendation
        });

    } catch (error) {
        console.error('建议生成错误:', error);
        res.status(500).json({
            error: '建议生成失败',
            message: error.message
        });
    }
});

// 拆解任务能力
async function analyzeTaskSkills(task, profession, age) {
    const prompt = `
作为一个专业的能力分析师，请分析完成以下任务需要哪些核心能力：

任务：${task}
职业：${profession}
年龄：${age}岁

请列出完成这个任务需要的2~4个核心能力，每个能力用简洁的名称描述（不超过10个字）。

请以JSON格式返回，格式如下：
{
  "skills": [
    "能力1",
    "能力2",
    "能力3"
  ]
}
`;

    return await tryWithBackupModels(modelConfig.currentModel, async (client, model) => {
        const response = await client.chat.completions.create({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });

        try {
            const content = response.choices[0].message.content;
            console.log('=== 任务分析 - LLM原始返回 ===');
            console.log(content);
            console.log('=== 原始返回结束 ===');
            
            const cleanedContent = cleanJsonResponse(content);
            console.log('=== 清理后的JSON ===');
            console.log(cleanedContent);
            console.log('=== 清理结束 ===');
            
            return JSON.parse(cleanedContent);
        } catch (parseError) {
            console.error('JSON解析失败:', parseError.message);
            console.log('尝试解析的内容:', response.choices[0].message.content);
            // 如果JSON解析失败，返回默认结构
            return {
                skills: ["技能分析", "问题解决", "沟通表达"]
            };
        }
    });
}

// 计算能力发展程度分数
function calculateDevelopmentScore(userLevel) {
    // 根据用户当前水平计算继续提升的边际效益
    const levelMap = {
        '初学者：刚开始接触，基本不会': { score: 9, reason: '从零基础开始学习，提升空间巨大，边际效益很高' },
        '基础：有一定了解，能完成简单任务': { score: 8, reason: '已有基础但仍有很大提升空间，继续学习性价比高' },
        '中级：比较熟练，能独立完成大部分任务': { score: 6, reason: '已达到中等水平，继续提升有一定价值但边际效益递减' },
        '高级：非常熟练，能处理复杂任务和指导他人': { score: 4, reason: '已达到高级水平，继续提升的边际效益较低' },
        '专家：该领域专家，能创新和解决前沿问题': { score: 2, reason: '已是专家级别，继续提升的边际效益很低，更多是维持现有水平' }
    };
    
    return levelMap[userLevel] || { score: 5, reason: '需要进一步评估当前水平' };
}

// 评估单个能力
async function evaluateSkill(skill, userLevel, task, profession, age, retirementAge, durationScore) {
    // 生成能力应用时间的说明
    const remainingYears = retirementAge - age;
    const durationReason = age >= retirementAge 
        ? "已达到能力应用截止年龄，无未来应用时间" 
        : `距离${retirementAge}岁能力应用截止还有${remainingYears}年，未来可应用时间${remainingYears > 20 ? '较长' : remainingYears > 10 ? '中等' : '较短'}`;

    // 本地计算能力发展程度
    const development = calculateDevelopmentScore(userLevel);

    const prompt = `
请作为专业的能力评估师，针对以下信息进行二维度评估：

任务：${task}
职业：${profession}
年龄：${age}岁
能力应用截止年龄：${retirementAge}岁
能力：${skill}
用户当前水平：${userLevel}

能力应用时间已计算完成：
- 分数：${durationScore}分
- 理由：${durationReason}

能力发展程度已计算完成：
- 分数：${development.score}分
- 理由：${development.reason}

请对其余两个维度进行评估（每个维度1-10分）：

1. 能力持续性：这项能力被AI等技术替代的概率（逆向评分）
   - 分数越高表示越不容易被替代
   - 创造性、情感类能力通常分数更高

2. 能力相关度：这项能力与用户职业发展的相关程度
   - 分数越高表示与职业发展越相关
   - 核心专业技能通常分数更高

请以JSON格式返回，包含评分和简短说明：
{
  "skill": "${skill}",
  "sustainability": {
    "score": 分数,
    "reason": "评分理由"
  },
  "relevance": {
    "score": 分数,
    "reason": "评分理由"
  }
}
`;

    return await tryWithBackupModels(modelConfig.currentModel, async (client, model) => {
        const response = await client.chat.completions.create({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
        });

        try {
            const content = response.choices[0].message.content;
            console.log('=== 能力评估 - LLM原始返回 ===');
            console.log(content);
            console.log('=== 原始返回结束 ===');
            
            const cleanedContent = cleanJsonResponse(content);
            console.log('=== 清理后的JSON ===');
            console.log(cleanedContent);
            console.log('=== 清理结束 ===');
            
            const evaluation = JSON.parse(cleanedContent);
            // 添加本地计算的维度
            evaluation.development = development;
            evaluation.duration = {
                score: durationScore,
                reason: durationReason
            };
            // 计算总分
            evaluation.totalScore = evaluation.development.score + 
                                   evaluation.duration.score + 
                                   evaluation.sustainability.score + 
                                   evaluation.relevance.score;
            return evaluation;
        } catch (parseError) {
            console.error('JSON解析失败:', parseError.message);
            console.log('尝试解析的内容:', response.choices[0].message.content);
            // 返回默认评估
            return {
                skill: skill,
                development: development,
                duration: { score: durationScore, reason: durationReason },
                sustainability: { score: 5, reason: "需要进一步评估" },
                relevance: { score: 5, reason: "需要进一步评估" },
                totalScore: development.score + durationScore + 10
            };
        }
    });
}

// 生成最终建议
async function generateRecommendation(evaluations, task, profession, age) {
    const prompt = `
基于以下能力评估结果，请为用户提供AI参与建议：

任务：${task}
职业：${profession}
年龄：${age}岁

能力评估结果：
${JSON.stringify(evaluations, null, 2)}

请根据评估结果，为每个能力推荐AI的角色：
- 下属（总分≤15）：能力发展程度低，可以让AI代劳
- 导师（总分16-25，且能力应用时间高）：有提升价值，让AI指导学习
- 工具（总分16-25，且能力持续性低）：能力即将过时，让AI作为工具
- 同事（总分16-25，且能力相关度低）：非核心能力，让AI协作完成
- 自主完成（总分≥26）：高价值能力，建议自己完成

请以JSON格式返回：
{
  "overallRecommendation": "整体建议",
  "aiRole": "主要AI角色（下属/导师/工具/同事/无）",
  "autonomyLevel": "自主思考程度（1-10分）",
  "skillRecommendations": [
    {
      "skill": "能力名称",
      "aiRole": "AI角色",
      "reason": "推荐理由",
      "action": "具体行动建议"
    }
  ],
  "summary": "总结性建议"
}
`;

    return await tryWithBackupModels(modelConfig.currentModel, async (client, model) => {
        const response = await client.chat.completions.create({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
        });

        try {
            const content = response.choices[0].message.content;
            console.log('=== 最终建议 - LLM原始返回 ===');
            console.log(content);
            console.log('=== 原始返回结束 ===');
            
            const cleanedContent = cleanJsonResponse(content);
            console.log('=== 清理后的JSON ===');
            console.log(cleanedContent);
            console.log('=== 清理结束 ===');
            
            return JSON.parse(cleanedContent);
        } catch (parseError) {
            console.error('JSON解析失败:', parseError.message);
            console.log('尝试解析的内容:', response.choices[0].message.content);
            return {
                overallRecommendation: "建议根据具体情况灵活运用AI",
                aiRole: "工具",
                autonomyLevel: 5,
                skillRecommendations: [],
                summary: "请重新分析以获得更准确的建议"
            };
        }
    });
}

// 敏感词检查API
router.post('/check-sensitive', async (req, res) => {
    try {
        const { text, fieldName } = req.body;

        if (!text) {
            return res.status(400).json({
                error: '缺少必要参数',
                message: '请提供要检查的文本'
            });
        }

        const validation = filter.validateInput(text, fieldName || '输入内容');
        
        res.json({
            success: true,
            data: {
                valid: validation.valid,
                message: validation.message,
                sensitiveWords: validation.sensitiveWords || []
            }
        });

    } catch (error) {
        console.error('敏感词检查错误:', error);
        res.status(500).json({
            error: '检查失败',
            message: error.message
        });
    }
});

module.exports = router; 
