import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

class AIService {
  constructor() {
    this.openai = null;
    this.gemini = null;
    this.provider = process.env.AI_PROVIDER || 'openai';
    this.isAvailable = false;
    this.initializeAI();
  }

  initializeAI() {
    try {
      // Fetch the key from environment variables and configure Gemini
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
        this.gemini = new GoogleGenerativeAI(geminiApiKey);
        if (this.provider === 'gemini') {
          this.isAvailable = true;
          console.log('✅ Gemini AI service initialized');
          return;
        }
      }

      // Fetch OpenAI key and configure
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (openaiApiKey && openaiApiKey !== 'your_actual_openai_api_key_here') {
        this.openai = new OpenAI({ apiKey: openaiApiKey });
        if (this.provider === 'openai') {
          this.isAvailable = true;
          console.log('✅ OpenAI service initialized');
          return;
        }
      }

      console.log('⚠️  No AI provider configured. Using fallback mode.');
    } catch (error) {
      console.warn('⚠️  AI initialization failed:', error.message);
    }
  }

  async testConnection() {
    if (!this.isAvailable) {
      return { success: false, error: 'No AI provider configured' };
    }

    try {
      if (this.provider === 'gemini' && this.gemini) {
        const model = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hello');
        return { success: true, provider: 'gemini', model: 'gemini-1.5-flash' };
      }

      if (this.provider === 'openai' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 5
        });
        return { success: true, provider: 'openai', model: response.model };
      }

      return { success: false, error: 'Provider not available' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async generateContentSuggestions(title, content = '') {
    const fallbackSuggestions = this.getFallbackSuggestions(title, content);
    
    if (!this.isAvailable) {
      return {
        suggestions: fallbackSuggestions,
        source: 'fallback',
        message: 'Using smart suggestions (No AI provider configured)'
      };
    }

    try {
      const prompt = `Based on the blog title "${title}" and content "${content.substring(0, 500)}", provide 3 specific content improvement suggestions. Focus on structure, engagement, and value for readers.`;
      
      let aiSuggestions = [];

      if (this.provider === 'gemini' && this.gemini) {
        const model = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        aiSuggestions = response.text()
          .split('\n')
          .filter(s => s.trim())
          .slice(0, 3);
      } else if (this.provider === 'openai' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300,
          temperature: 0.7
        });
        aiSuggestions = response.choices[0].message.content
          .split('\n')
          .filter(s => s.trim())
          .slice(0, 3);
      }

      return {
        suggestions: aiSuggestions.length > 0 ? aiSuggestions : fallbackSuggestions,
        source: aiSuggestions.length > 0 ? this.provider : 'fallback',
        message: aiSuggestions.length > 0 ? `AI-powered suggestions (${this.provider})` : 'Using fallback suggestions'
      };
    } catch (error) {
      console.warn(`${this.provider} API failed:`, error.message);
      return {
        suggestions: fallbackSuggestions,
        source: 'fallback',
        message: `Using smart suggestions (${this.provider} API error)`
      };
    }
  }

  async optimizeSEO(title, content) {
    const fallbackSEO = this.getFallbackSEO(title, content);
    
    if (!this.isAvailable) {
      return { ...fallbackSEO, source: 'fallback' };
    }

    try {
      const prompt = `Optimize SEO for this blog post:
Title: "${title}"
Content: "${content.substring(0, 800)}"

Provide:
1. SEO Title (max 60 chars)
2. Meta Description (max 160 chars)
3. 5 keywords (comma-separated)`;

      let result = '';

      if (this.provider === 'gemini' && this.gemini) {
        const model = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(prompt);
        result = (await response.response).text();
      } else if (this.provider === 'openai' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 200,
          temperature: 0.5
        });
        result = response.choices[0].message.content;
      }
      
      return {
        seoTitle: this.extractSEOTitle(result) || fallbackSEO.seoTitle,
        metaDescription: this.extractMetaDescription(result) || fallbackSEO.metaDescription,
        keywords: this.extractKeywords(result) || fallbackSEO.keywords,
        source: this.provider
      };
    } catch (error) {
      return { ...fallbackSEO, source: 'fallback' };
    }
  }

  async generateTags(title, content) {
    const fallbackTags = this.getFallbackTags(title, content);
    
    if (!this.isAvailable) {
      return fallbackTags;
    }

    try {
      const prompt = `Generate 5-8 relevant tags for this blog post:
Title: "${title}"
Content: "${content.substring(0, 500)}"

Return only the tags, separated by commas.`;

      let result = '';

      if (this.provider === 'gemini' && this.gemini) {
        const model = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(prompt);
        result = (await response.response).text();
      } else if (this.provider === 'openai' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 100,
          temperature: 0.6
        });
        result = response.choices[0].message.content;
      }

      const tags = result
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .slice(0, 8);

      return tags.length > 0 ? tags : fallbackTags;
    } catch (error) {
      return fallbackTags;
    }
  }

  getFallbackSuggestions(title, content) {
    return [
      `Add a compelling introduction that hooks readers with a question or interesting fact about "${title}".`,
      `Break your content into clear sections with descriptive headings to improve readability.`,
      `Include practical examples or actionable tips that readers can apply immediately.`
    ];
  }

  getFallbackSEO(title, content) {
    let seoTitle = title;
    if (title.length > 60) {
      seoTitle = title.substring(0, 57) + '...';
    }
    
    let metaDescription = '';
    if (content && content.length > 0) {
      const sentences = content.split('.').filter(s => s.trim().length > 20);
      if (sentences.length > 0) {
        metaDescription = sentences[0].trim() + '.';
      } else {
        metaDescription = content.substring(0, 150).trim();
      }
    } else {
      metaDescription = `Learn about ${title}. Comprehensive guide and insights.`;
    }
    
    if (metaDescription.length > 160) {
      metaDescription = metaDescription.substring(0, 157) + '...';
    }
    
    const titleWords = title.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    const contentWords = content.toLowerCase().split(/\s+/).filter(word => word.length > 4);
    const allWords = [...titleWords, ...contentWords];
    const wordFreq = {};
    
    allWords.forEach(word => {
      const clean = word.replace(/[^a-z]/g, '');
      if (clean.length > 3) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    });
    
    const keywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
    
    return { seoTitle, metaDescription, keywords };
  }

  getFallbackTags(title, content) {
    const words = (title + ' ' + content).toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    return [...new Set(words)].slice(0, 5);
  }

  extractSEOTitle(text) {
    const match = text.match(/(?:seo title|title)[:\s]*([^\n]+)/i);
    return match ? match[1].trim().substring(0, 60) : null;
  }

  extractMetaDescription(text) {
    const match = text.match(/(?:meta description|description)[:\s]*([^\n]+)/i);
    return match ? match[1].trim().substring(0, 160) : null;
  }

  extractKeywords(text) {
    const match = text.match(/(?:keywords?)[:\s]*([^\n]+)/i);
    return match ? match[1].split(',').map(k => k.trim()) : null;
  }

  calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}

export default new AIService();