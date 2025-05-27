// 全局变量
let currentStep = 1;
let taskData = {};
let skillsData = [];
let evaluationsData = [];

// DOM元素
const loading = document.getElementById('loading');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 绑定表单提交事件
    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);
    
    // 绑定错误模态框关闭事件
    document.querySelector('.close').addEventListener('click', closeErrorModal);
    
    // 绑定联系作者链接
    document.getElementById('feedback-link').addEventListener('click', function(e) {
        e.preventDefault();
        showQrModal();
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        const errorModal = document.getElementById('errorModal');
        const infoModal = document.getElementById('infoModal');
        const qrModal = document.getElementById('qrModal');
        
        if (event.target === errorModal) {
            closeErrorModal();
        }
        if (event.target === infoModal) {
            closeInfoModal();
        }
        if (event.target === qrModal) {
            closeQrModal();
        }
    });

}

// 敏感词检查函数
async function checkSensitiveWords(text, fieldName) {
    try {
        const response = await fetch('/api/check-sensitive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, fieldName })
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || '敏感词检查失败');
        }

        return result.data;
    } catch (error) {
        console.error('敏感词检查错误:', error);
        // 如果检查失败，默认通过
        return { valid: true, message: '检查通过' };
    }
}

// 处理任务提交
async function handleTaskSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    taskData = {
        task: formData.get('task').trim(),
        profession: formData.get('profession').trim(),
        age: parseInt(formData.get('age')),
        retirementAge: parseInt(formData.get('retirementAge'))
    };

    if (!taskData.task || !taskData.profession || !taskData.age || !taskData.retirementAge) {
        showError('请填写完整的任务信息');
        return;
    }

    if (taskData.age >= taskData.retirementAge) {
        showError('当前年龄不能大于或等于能力应用截止年龄');
        return;
    }

    // 敏感词检查
    showLoading('正在检查内容...');
    
    const taskCheck = await checkSensitiveWords(taskData.task, '任务描述');
    if (!taskCheck.valid) {
        hideLoading();
        showError(taskCheck.message);
        return;
    }

    const professionCheck = await checkSensitiveWords(taskData.profession, '职业');
    if (!professionCheck.valid) {
        hideLoading();
        showError(professionCheck.message);
        return;
    }

    try {
        showLoading('AI正在分析任务...');
        
        const response = await fetch('/api/analyze-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || '任务分析失败');
        }

        skillsData = result.data.analysis.skills || [];
        displaySkillsAnalysis();
        nextStep();
        
    } catch (error) {
        console.error('任务分析错误:', error);
        showError(error.message || '任务分析失败，请重试');
    } finally {
        hideLoading();
    }
}

// 显示技能分析结果
function displaySkillsAnalysis() {
    const container = document.getElementById('skillsAnalysis');
    
    if (skillsData.length === 0) {
        container.innerHTML = `
            <div class="skills-empty">
                <h3>暂无技能分析结果</h3>
                <p>请重新提交任务信息</p>
            </div>
        `;
        return;
    }

    // 统一的说明文字和技能列表
    const skillsHTML = `
        <div class="skills-analysis-container fade-in">
            <div class="skills-header">
                <i class="fas fa-info-circle"></i>
                <span>完成"${taskData.task}"需要运用以下核心能力</span>
            </div>
            
            <div class="skills-list">
                ${skillsData.map((skill, index) => `
                    <div class="skill-item fade-in" style="animation-delay: ${index * 0.1}s">
                        <i class="fas fa-lightbulb"></i>
                        <span>${skill}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="skills-action">
                <button class="btn-primary" onclick="startEvaluation()">
                    <i class="fas fa-arrow-right"></i>
                    开始能力评估
                </button>
            </div>
        </div>
    `;

    container.innerHTML = skillsHTML;
}

// 开始能力评估
function startEvaluation() {
    displaySkillEvaluation();
    nextStep();
}

// 显示技能评估表单
function displaySkillEvaluation() {
    const container = document.getElementById('skillEvaluation');
    
    // 统一的说明文字
    const instructionHTML = `
        <div class="evaluation-instruction fade-in" style="margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%); border-radius: 6px; color: white; text-align: center;">
            <h3 style="color: white; margin-bottom: 10px;">
                <i class="fas fa-chart-line"></i>
                能力水平评估
            </h3>
            <p style="margin: 0; font-size: 1.1rem; opacity: 0.9;">
                请拖动滑块评估您在各项能力方面的当前水平
            </p>
        </div>
    `;
    
    const evaluationHTML = skillsData.map((skill, index) => `
        <div class="evaluation-item fade-in" style="animation-delay: ${index * 0.1}s">
            <h3>
                <i class="fas fa-cog"></i>
                ${skill}
            </h3>
            <div class="skill-slider-container">
                <div class="slider-labels">
                    <span>初学者</span>
                    <span>基础</span>
                    <span>中级</span>
                    <span>高级</span>
                    <span>专家</span>
                </div>
                <div class="skill-slider">
                    <input type="range" 
                           id="${skill}_slider" 
                           name="${skill}_level" 
                           min="1" 
                           max="5" 
                           value="3" 
                           class="slider"
                           data-skill="${skill}">
                    <div class="slider-track"></div>
                    <div class="slider-fill"></div>
                </div>
                <div class="current-level">
                    <span id="${skill}_level_text">中级</span>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = instructionHTML + evaluationHTML + `
        <div style="text-align: center; margin-top: 30px;">
            <button class="btn-primary" onclick="submitEvaluations()">
                <i class="fas fa-calculator"></i>
                提交评估
            </button>
        </div>
    `;
    
    // 初始化滑块事件
    initializeSliders();
}

// 计算能力应用时间分数
function calculateDurationScore(age, retirementAge) {
    if (age >= retirementAge) {
        return 0; // 已达到或超过能力应用截止年龄
    }
    
    const remainingYears = retirementAge - age;
    const totalWorkingYears = retirementAge - 18; // 假设18岁开始工作
    const score = Math.round((remainingYears / totalWorkingYears) * 10);
    
    return Math.max(1, Math.min(10, score)); // 确保分数在1-10之间
}

// 初始化滑块
function initializeSliders() {
    const sliders = document.querySelectorAll('.slider');
    
    sliders.forEach(slider => {
        const skill = slider.dataset.skill;
        const levelText = document.getElementById(`${skill}_level_text`);
        const sliderFill = slider.parentElement.querySelector('.slider-fill');
        
        // 更新滑块显示
        function updateSlider() {
            const value = parseInt(slider.value);
            const percentage = ((value - 1) / 4) * 100;
            
            // 更新填充条
            sliderFill.style.width = percentage + '%';
            
            // 更新文字显示
            const levels = ['初学者', '基础', '中级', '高级', '专家'];
            levelText.textContent = levels[value - 1];
            
            // 更新颜色 - 使用蓝色系渐变
            const colors = ['#ff6b6b', '#ffa726', 'var(--primary-color)', '#5a9cff', '#1a73e8'];
            sliderFill.style.background = colors[value - 1];
        }
        
        // 初始化显示
        updateSlider();
        
        // 绑定事件
        slider.addEventListener('input', updateSlider);
    });
}

// 提交能力评估
async function submitEvaluations() {
    const evaluations = [];
    
    for (const skill of skillsData) {
        const slider = document.getElementById(`${skill}_slider`);
        if (!slider) {
            showError('评估表单初始化错误，请刷新页面重试');
            return;
        }
        
        const value = parseInt(slider.value);
        const levels = [
            '初学者：刚开始接触，基本不会',
            '基础：有一定了解，能完成简单任务', 
            '中级：比较熟练，能独立完成大部分任务',
            '高级：非常熟练，能处理复杂任务和指导他人',
            '专家：该领域专家，能创新和解决前沿问题'
        ];
        
        evaluations.push({
            skill: skill,
            userLevel: levels[value - 1]
        });
    }

    try {
        const totalSkills = evaluations.length;
        showLoading(`AI正在评估您的第1个能力...`, true, 0, totalSkills);
        
        // 逐个评估每个技能
        evaluationsData = [];
        for (let i = 0; i < evaluations.length; i++) {
            const evaluation = evaluations[i];
            
            // 更新进度显示
            updateProgress(i, totalSkills, `AI正在评估您的第${i + 1}个能力：${evaluation.skill}`);
            
            // 本地计算能力应用时间分数
            const durationScore = calculateDurationScore(taskData.age, taskData.retirementAge);
            
            const response = await fetch('/api/evaluate-skill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...evaluation,
                    ...taskData,
                    durationScore: durationScore
                })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || '能力评估失败');
            }

            evaluationsData.push(result.data);
            
            // 更新完成进度
            updateProgress(i + 1, totalSkills, `已完成第${i + 1}个能力评估：${evaluation.skill}`);
            
            // 短暂延迟，让用户看到进度更新
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // 获取最终建议
        updateProgress(totalSkills, totalSkills, 'AI正在生成个性化建议...');
        
        const recommendationResponse = await fetch('/api/get-recommendation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                evaluations: evaluationsData,
                ...taskData
            })
        });

        const recommendationResult = await recommendationResponse.json();
        
        if (!recommendationResponse.ok) {
            throw new Error(recommendationResult.message || '建议生成失败');
        }

        displayResults(recommendationResult.data);
        nextStep();
        
    } catch (error) {
        console.error('评估错误:', error);
        showError(error.message || '评估失败，请重试');
    } finally {
        hideLoading();
    }
}

// 显示结果
function displayResults(recommendation) {
    const container = document.getElementById('results');
    
    // 整体建议卡片
    const overallCard = `
        <div class="result-card fade-in">
            <div class="result-header">
                <div class="skill-title-row">
                    <h3><i class="fas fa-lightbulb"></i> 整体建议</h3>
                    <div class="ai-role-badge ${getAiRoleClass(recommendation.aiRole)}">
                        AI角色：${recommendation.aiRole}
                    </div>
                </div>
            </div>
            <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">
                ${recommendation.overallRecommendation}
            </p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                <h4 style="margin-bottom: 10px;">
                    <i class="fas fa-brain"></i> 
                    建议自主思考程度：${recommendation.autonomyLevel}/10
                </h4>
                <div style="background: #e9ecef; height: 10px; border-radius: 5px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); height: 100%; width: ${recommendation.autonomyLevel * 10}%; transition: width 0.5s ease;"></div>
                </div>
            </div>
        </div>
    `;

    // 技能详细评估卡片
    const skillCards = evaluationsData.map((evaluation, index) => {
        const skillRecommendation = recommendation.skillRecommendations.find(
            rec => rec.skill === evaluation.skill
        ) || {};

        // 所有能力都可以折叠，第一个能力默认展开
        const collapseClass = 'collapsible-card';
        const collapseStyle = index > 0 ? 'style="display: none;"' : '';

        return `
            <div class="result-card fade-in ${collapseClass}" style="animation-delay: ${(index + 1) * 0.1}s" data-skill-index="${index}">
                <div class="result-header" onclick="toggleSkillCard(${index})">
                    <div class="skill-title-row">
                        <h3>
                            <i class="fas fa-cog"></i> 
                            能力${index + 1}：${evaluation.skill}
                        </h3>
                        <div class="ai-role-badge ${getAiRoleClass(skillRecommendation.aiRole)}">
                            AI角色：${skillRecommendation.aiRole || 'AI工具'}
                        </div>
                        <div class="collapse-control">
                            <span class="collapse-text">${index === 0 ? '折叠' : '展开'}</span>
                            <i class="fas fa-chevron-down collapse-icon" style="transform: ${index === 0 ? 'rotate(180deg)' : 'rotate(0deg)'}"></i>
                        </div>
                    </div>
                </div>
                <div class="skill-details" ${collapseStyle}>
                    <div class="skill-evaluation-grid">
                        <div class="evaluation-metric">
                            <div class="metric-score">${evaluation.development.score}</div>
                            <div class="metric-label">能力发展程度</div>
                            <div class="metric-reason">${evaluation.development.reason}</div>
                        </div>
                        <div class="evaluation-metric">
                            <div class="metric-score">${evaluation.duration.score}</div>
                            <div class="metric-label">能力应用时间</div>
                            <div class="metric-reason">${evaluation.duration.reason}</div>
                        </div>
                        <div class="evaluation-metric">
                            <div class="metric-score">${evaluation.sustainability.score}</div>
                            <div class="metric-label">能力持续性</div>
                            <div class="metric-reason">${evaluation.sustainability.reason}</div>
                        </div>
                        <div class="evaluation-metric">
                            <div class="metric-score">${evaluation.relevance.score}</div>
                            <div class="metric-label">能力相关度</div>
                            <div class="metric-reason">${evaluation.relevance.reason}</div>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-top: 20px;">
                        <h4 style="margin-bottom: 10px; color: #333;">
                            <i class="fas fa-star"></i> 
                            综合评分：${evaluation.totalScore}/40
                        </h4>
                        ${skillRecommendation.reason ? `
                            <p style="margin-bottom: 15px; color: #666;">
                                <strong>推荐理由：</strong>${skillRecommendation.reason}
                            </p>
                        ` : ''}
                        ${skillRecommendation.action ? `
                            <p style="color: var(--primary-color); font-weight: 500;">
                                <i class="fas fa-arrow-right"></i> 
                                <strong>行动建议：</strong>${skillRecommendation.action}
                            </p>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // 总结卡片
    const summaryCard = `
        <div class="result-card fade-in" style="animation-delay: ${(evaluationsData.length + 1) * 0.1}s; background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); color: white;">
            <h3 style="color: white; margin-bottom: 20px;">
                <i class="fas fa-flag-checkered"></i> 
                总结建议
            </h3>
            <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">
                ${recommendation.summary}
            </p>
            <div style="text-align: center; display: flex; flex-direction: column; gap: 15px; align-items: center;">
                <button class="btn-secondary mobile-toggle-btn" onclick="toggleAllSkills()" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); width: 200px; justify-content: center;">
                    <i class="fas fa-eye" id="toggleIcon"></i>
                    <span id="toggleText">展开所有能力</span>
                </button>
                <button class="btn-secondary" onclick="restartAnalysis()" style="background: white; color: var(--primary-color); width: 200px; justify-content: center;">
                    <i class="fas fa-redo"></i>
                    重新分析
                </button>
            </div>
        </div>
    `;

    container.innerHTML = overallCard + skillCards + summaryCard;
}

// 获取AI角色对应的CSS类
function getAiRoleClass(role) {
    const roleMap = {
        '下属': 'subordinate',
        '导师': 'mentor', 
        '工具': 'tool',
        '同事': 'colleague',
        '无': 'autonomous'
    };
    return roleMap[role] || 'tool';
}

// 重新开始分析
function restartAnalysis() {
    currentStep = 1;
    taskData = {};
    skillsData = [];
    evaluationsData = [];
    
    // 重置表单
    document.getElementById('taskForm').reset();
    
    // 显示第一步
    showStep(1);
}

// 步骤导航
function nextStep() {
    currentStep++;
    showStep(currentStep);
}

function showStep(step) {
    // 隐藏所有步骤
    document.querySelectorAll('.step-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 显示当前步骤
    const currentSection = document.getElementById(`step${step}`);
    if (currentSection) {
        currentSection.classList.add('active');
        currentSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 显示加载动画
function showLoading(message = 'AI正在分析中...', showProgress = false, current = 0, total = 0) {
    const loadingText = document.getElementById('loadingText');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (loadingText) {
        loadingText.textContent = message;
    }
    
    if (showProgress) {
        progressContainer.style.display = 'block';
        const percentage = total > 0 ? (current / total) * 100 : 0;
        progressFill.style.width = percentage + '%';
        progressText.textContent = `${current}/${total}`;
    } else {
        progressContainer.style.display = 'none';
    }
    
    loading.classList.add('show');
}

// 更新进度
function updateProgress(current, total, message) {
    const loadingText = document.getElementById('loadingText');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (loadingText) {
        loadingText.textContent = message;
    }
    
    const percentage = total > 0 ? (current / total) * 100 : 0;
    progressFill.style.width = percentage + '%';
    progressText.textContent = `${current}/${total}`;
}

// 隐藏加载动画
function hideLoading() {
    loading.classList.remove('show');
    // 重置进度条
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    progressContainer.style.display = 'none';
    progressFill.style.width = '0%';
}

// 显示错误信息
function showError(message) {
    errorMessage.textContent = message;
    errorModal.classList.add('show');
}

// 关闭错误模态框
function closeErrorModal() {
    errorModal.classList.remove('show');
}

// 显示信息模态框
function showInfoModal() {
    const infoModal = document.getElementById('infoModal');
    infoModal.classList.add('show');
}

// 关闭信息模态框
function closeInfoModal() {
    const infoModal = document.getElementById('infoModal');
    infoModal.classList.remove('show');
}

// 显示二维码模态框
function showQrModal() {
    const qrModal = document.getElementById('qrModal');
    qrModal.classList.add('show');
}

// 关闭二维码模态框
function closeQrModal() {
    const qrModal = document.getElementById('qrModal');
    qrModal.classList.remove('show');
}

// 切换单个技能卡片
function toggleSkillCard(index) {
    const card = document.querySelector(`[data-skill-index="${index}"]`);
    const details = card.querySelector('.skill-details');
    const icon = card.querySelector('.collapse-icon');
    const text = card.querySelector('.collapse-text');
    
    if (details.style.display === 'none') {
        details.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
        if (text) text.textContent = '折叠';
    } else {
        details.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
        if (text) text.textContent = '展开';
    }
}

// 切换所有技能卡片
function toggleAllSkills() {
    const collapsibleCards = document.querySelectorAll('.collapsible-card');
    const toggleIcon = document.getElementById('toggleIcon');
    const toggleText = document.getElementById('toggleText');
    
    if (!collapsibleCards.length) return;
    
    // 检查是否所有能力都已展开
    let allExpanded = true;
    collapsibleCards.forEach(card => {
        const details = card.querySelector('.skill-details');
        if (details.style.display === 'none') {
            allExpanded = false;
        }
    });
    
    collapsibleCards.forEach(card => {
        const details = card.querySelector('.skill-details');
        const icon = card.querySelector('.collapse-icon');
        const text = card.querySelector('.collapse-text');
        
        if (allExpanded) {
            // 折叠所有
            details.style.display = 'none';
            if (icon) icon.style.transform = 'rotate(0deg)';
            if (text) text.textContent = '展开';
        } else {
            // 展开所有
            details.style.display = 'block';
            if (icon) icon.style.transform = 'rotate(180deg)';
            if (text) text.textContent = '折叠';
        }
    });
    
    // 更新按钮文字和图标
    if (allExpanded) {
        toggleIcon.className = 'fas fa-eye';
        toggleText.textContent = '展开所有能力';
    } else {
        toggleIcon.className = 'fas fa-eye-slash';
        toggleText.textContent = '折叠所有能力';
    }
} 