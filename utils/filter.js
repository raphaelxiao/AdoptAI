const fs = require('fs');
const path = require('path');

class SensitiveWordFilter {
    constructor() {
        this.sensitiveWords = [];
        this.loadSensitiveWords();
    }

    // 加载敏感词列表
    loadSensitiveWords() {
        try {
            const filterPath = path.join(__dirname, '../filter.txt');
            const content = fs.readFileSync(filterPath, 'utf-8');
            this.sensitiveWords = content
                .split('\n')
                .map(word => word.trim())
                .filter(word => word.length > 0)
                .map(word => word.toLowerCase());
            
            console.log(`已加载 ${this.sensitiveWords.length} 个敏感词`);
        } catch (error) {
            console.error('加载敏感词文件失败:', error);
            this.sensitiveWords = [];
        }
    }

    // 检查文本是否包含敏感词
    containsSensitiveWord(text) {
        if (!text || typeof text !== 'string') {
            return false;
        }

        const lowerText = text.toLowerCase();
        
        for (const word of this.sensitiveWords) {
            if (lowerText.includes(word)) {
                return true;
            }
        }
        
        return false;
    }

    // 获取文本中的敏感词列表
    findSensitiveWords(text) {
        if (!text || typeof text !== 'string') {
            return [];
        }

        const lowerText = text.toLowerCase();
        const foundWords = [];
        
        for (const word of this.sensitiveWords) {
            if (lowerText.includes(word)) {
                foundWords.push(word);
            }
        }
        
        return foundWords;
    }

    // 过滤敏感词（用*替换）
    filterSensitiveWords(text) {
        if (!text || typeof text !== 'string') {
            return text;
        }

        let filteredText = text;
        
        for (const word of this.sensitiveWords) {
            const regex = new RegExp(word, 'gi');
            const replacement = '*'.repeat(word.length);
            filteredText = filteredText.replace(regex, replacement);
        }
        
        return filteredText;
    }

    // 验证输入内容
    validateInput(text, fieldName = '输入内容') {
        const foundWords = this.findSensitiveWords(text);
        
        if (foundWords.length > 0) {
            return {
                valid: false,
                message: `${fieldName}包含敏感词，请修改后重试`,
                sensitiveWords: foundWords
            };
        }
        
        return {
            valid: true,
            message: '内容检查通过'
        };
    }
}

// 创建单例实例
const filter = new SensitiveWordFilter();

module.exports = filter; 