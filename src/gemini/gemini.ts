import { ContentListUnion, GoogleGenAI } from '@google/genai';
import { Config } from '../config';

export default class Gemini {
    private readonly config: Config;
    private readonly ai: GoogleGenAI;
    constructor(config: Config) {
        this.config = config;
        this.ai = new GoogleGenAI({
            apiKey: config.gemini.apiKey
        });
    }

    async generateText(prompt: string): Promise<string> {
        const result = await this.ai.models.generateContent({
            model: this.config.gemini.model,
            contents: [
                {
                    text: prompt,
                },
            ],
        });
        return result.text ?? '';
    }

    async generateStructuredOutput<T>(contents: ContentListUnion, struct: Record<string, any>): Promise<T> {
        const result = await this.ai.models.generateContent({
            model: this.config.gemini.model,
            contents: contents,
            config: {
                responseMimeType: 'application/json',
                responseSchema: struct,
                thinkingConfig: {
                    thinkingBudget: 0,
                }
            },
        });
        if (!result.text) {
            throw new Error('No response from Gemini');
        }
        return JSON.parse(result.text) as T;
    }
}
