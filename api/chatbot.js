// api/chatbot.js

// Ensure we're using node-fetch if running in a Node.js environment locally
// Vercel's environment provides fetch globally.
const fetch = global.fetch || require('node-fetch');

// Define safety settings (can be adjusted)
const safetySettings = [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
];

const SYSTEM_PROMPT = `You are a professional Australian tax and accounting assistant for MG Accounting. Your responses should be:

1. Professional and authoritative - use proper business terminology while remaining clear and accessible
2. Concise - keep responses brief and to the point (max 2-3 sentences)
3. Accurate - base all answers on the provided knowledge base
4. Context-aware - consider the conversation history and detected topics when responding
5. Helpful - provide actionable information when possible

Guidelines:
- Use proper business language, avoiding casual terms
- Maintain a professional yet approachable tone
- Focus on one key point per response
- If unsure, suggest consulting with MG Accounting
- Never use jargon without explanation
- Keep responses under 50 words unless specifically asked for more detail
- Adapt your response style based on the detected topic:
  * Tax: Be precise with numbers and deadlines
  * Business: Focus on practical steps and compliance
  * Superannuation: Emphasize long-term benefits
  * Bookkeeping: Provide clear, actionable steps
  * Payroll: Be specific about legal requirements
  * General: Be welcoming and guide to specific topics

Conversation Flow:
- Start with a clear, direct answer
- If the topic is complex, break it into steps
- End with a relevant follow-up question or next step
- Use the conversation history to maintain context
- If the user switches topics, acknowledge the change

Knowledge Base:
${knowledgeBase}

Remember: You are a professional advisor, not a casual friend. Maintain appropriate business communication standards while being helpful and clear. Your goal is to provide accurate, actionable information while guiding users toward professional consultation when needed.`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Mistral API key not configured' });
    }

    try {
        const { message, history } = req.body;
        
        // Combine history with current message for context
        const conversationContext = history ? `${history}\nUser: ${message}` : `User: ${message}`;
        
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'mistral-small',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: conversationContext }
                ],
                temperature: 0.7,
                max_tokens: 150
            })
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to get response from Mistral API' });
    }
} 