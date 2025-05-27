// 模型配置
const modelConfig = {
    // 当前使用的模型
    currentModel: process.env.AI_MODEL || "Pro/deepseek-ai/DeepSeek-V3",
    
    // 达到Rate limit时的备选模型
    backupModels: [
        "Pro/deepseek-ai/DeepSeek-V3", 
        "deepseek-v3", 
        "Qwen/Qwen2.5-72B-Instruct"
    ],
    
    // 模型提供商配置
    providers: {
        // DeepSeek 官方API
        deepseek: {
            models: ["deepseek-reasoner", "deepseek-chat"],
            baseURL: "https://api.deepseek.com",
            apiKeyEnv: "DEEPSEEK_API_KEY"
        },
        
        // OpenAI 官方API
        openai: {
            models: ["gpt-4o", "gpt-4o-mini", "gpt-4", "gpt-3.5-turbo"],
            baseURL: "https://api.openai.com/v1",
            apiKeyEnv: "OPENAI_API_KEY"
        },
        
        // SiliconFlow API
        siliconflow: {
            models: [
                "deepseek-ai/DeepSeek-V3",
                "Qwen/Qwen2.5-72B-Instruct", 
                "Pro/deepseek-ai/DeepSeek-V3",
                "Qwen/Qwen3-235B-A22B",
                "Qwen/Qwen3-14B",
                "THUDM/GLM-4-32B-0414"
            ],
            baseURL: "https://api.siliconflow.cn/v1",
            apiKeyEnv: "SILICONFLOW_API_KEY"
        },
        
        // 阿里云DashScope API
        dashscope: {
            models: ["deepseek-v3"],
            baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
            apiKeyEnv: "DASHSCOPE_API_KEY"
        }
    }
};

// 获取模型对应的提供商配置
function getProviderConfig(model) {
    for (const [providerName, config] of Object.entries(modelConfig.providers)) {
        if (config.models.includes(model)) {
            return {
                name: providerName,
                ...config
            };
        }
    }
    throw new Error(`不支持的模型: ${model}`);
}

// 创建OpenAI客户端
function createClient(model) {
    const OpenAI = require('openai');
    const { HttpsProxyAgent } = require('https-proxy-agent');
    
    const providerConfig = getProviderConfig(model);
    const apiKey = process.env[providerConfig.apiKeyEnv];
    
    if (!apiKey) {
        throw new Error(`缺少API密钥: ${providerConfig.apiKeyEnv}`);
    }
    
    const clientConfig = {
        apiKey: apiKey,
        baseURL: providerConfig.baseURL,
        timeout: 30000, // 30秒超时
    };
    
    // 配置代理（如果需要）
    if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
        const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
        clientConfig.httpAgent = new HttpsProxyAgent(proxyUrl);
        console.log(`使用代理: ${proxyUrl}`);
    }
    
    console.log(`使用模型: ${model} (提供商: ${providerConfig.name})`);
    
    return new OpenAI(clientConfig);
}

// 尝试使用备选模型
async function tryWithBackupModels(originalModel, apiCall) {
    const modelsToTry = [originalModel, ...modelConfig.backupModels.filter(m => m !== originalModel)];
    
    for (let i = 0; i < modelsToTry.length; i++) {
        const model = modelsToTry[i];
        try {
            console.log(`🤖 尝试使用模型: ${model}`);
            const client = createClient(model);
            const result = await apiCall(client, model);
            
            if (i > 0) {
                console.log(`✅ 成功切换到备选模型: ${model}`);
            } else {
                console.log(`✅ 主模型调用成功: ${model}`);
            }
            
            return result;
        } catch (error) {
            console.error(`❌ 模型 ${model} 调用失败:`, error.message);
            console.error('错误详情:', error);
            
            if (i === modelsToTry.length - 1) {
                throw new Error(`所有模型都调用失败。最后尝试的模型: ${model}, 错误: ${error.message}`);
            }
            
            console.log(`🔄 尝试下一个备选模型...`);
        }
    }
}

module.exports = {
    modelConfig,
    getProviderConfig,
    createClient,
    tryWithBackupModels
}; 