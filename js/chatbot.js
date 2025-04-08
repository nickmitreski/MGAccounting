class Chatbot {
    constructor() {
        this.container = document.getElementById('chatbot-container');
        this.toggle = document.getElementById('chatbot-toggle');
        this.window = document.getElementById('chatbot-window');
        this.close = document.getElementById('chatbot-close');
        this.messages = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.send = document.getElementById('chatbot-send');
        this.badge = document.querySelector('.chatbot-badge');
        
        this.isOpen = false;
        this.conversationHistory = [];
        this.hasScheduledMeeting = false;
        this.calendlyWidget = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Toggle chat window
        this.toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleChat();
        });

        // Close chat window
        this.close.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleChat();
        });

        // Send message
        this.send.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.sendMessage();
        });

        // Handle Enter key
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                this.sendMessage();
            }
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.container.contains(e.target) && 
                !e.target.closest('.chatbot-container')) {
                this.toggleChat();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.window.classList.toggle('active', this.isOpen);
        this.badge.style.display = this.isOpen ? 'none' : 'flex';
        
        if (this.isOpen) {
            this.input.focus();
        }
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.input.value = '';

        // Prepare context for the AI
        const context = this.prepareContext();
        
        try {
            const response = await this.getAIResponse(message, context);
            this.addMessage(response, 'bot');
            
            // Check if response contains meeting scheduling suggestion
            if (response.toLowerCase().includes('schedule a meeting') && !this.hasScheduledMeeting) {
                this.addCalendlyWidget();
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.addMessage('I apologize, but I encountered an error. Please try again later.', 'bot');
        }
    }

    prepareContext() {
        return {
            website: 'MG Accounting',
            services: [
                'Tax Planning & Returns',
                'Business Advisory',
                'Bookkeeping & Payroll',
                'Wealth Management',
                'SMSF Services',
                'Business Structuring'
            ],
            location: 'Oakleigh, Melbourne',
            contact: {
                phone: '(03) 9563 4666',
                email: 'info@mgaccounting.com.au',
                address: '7-9 Station Street, Oakleigh VIC 3166'
            },
            hasScheduledMeeting: this.hasScheduledMeeting
        };
    }

    async getAIResponse(message, context) {
        const prompt = this.createPrompt(message, context);
        const API_KEY = 'AIzaSyBf64hc2_Kfwuich0pED9mjNWEvps4wJBA';
        
        try {
            console.log('Sending request to Gemini API...');
            const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            // Handle the response format for the v1 API
            if (!data.candidates || !data.candidates[0]) {
                console.error('No candidates in response:', data);
                return this.getDefaultResponse();
            }

            const text = data.candidates[0].content?.parts?.[0]?.text;
            if (!text) {
                console.error('No text in response parts:', data.candidates[0]);
                return this.getDefaultResponse();
            }

            return text;
        } catch (error) {
            console.error('Detailed error in getAIResponse:', {
                error: error,
                message: error.message,
                stack: error.stack
            });
            
            return this.getDefaultResponse(error);
        }
    }

    getDefaultResponse(error = null) {
        const responses = [
            "I'd be happy to tell you about our tax and accounting services. What's on your mind?",
            "Need help with taxes or business finances? Let me know what you're looking for.",
            "How can I help with your accounting needs today?",
            "Looking for tax advice or business support? I'm here to help."
        ];
        
        if (error) {
            console.error('Using default response due to error:', error);
        }
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    createPrompt(message, context) {
        return `You are a friendly accounting assistant. Keep responses under 2 sentences when possible. Be conversational but professional.

Quick facts:
- We offer: ${context.services.join(', ')}
- Based in: Oakleigh, Melbourne
- Phone: ${context.contact.phone}

Style guide:
- Be brief and natural, like a helpful receptionist
- Use everyday language, avoid jargon
- Responses should rarely exceed 2-3 lines
- Be warm but professional

User says: ${message}

Chat history:
${this.conversationHistory.slice(-2).map(msg => `${msg.role}: ${msg.content}`).join('\n')}`;
    }

    addMessage(content, role) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${role}`;
        messageDiv.textContent = content;
        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
        
        this.conversationHistory.push({ role, content });
    }

    addCalendlyWidget() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message bot';
        messageDiv.innerHTML = `
            <div class="calendly-widget-container">
                <p>I can help you schedule a consultation. Please select a time that works best for you:</p>
                <div class="calendly-inline-widget" data-url="https://calendly.com/mg-accounting" style="min-width:320px;height:600px;"></div>
            </div>
        `;
        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;

        // Initialize Calendly widget
        if (window.Calendly) {
            window.Calendly.initInlineWidgets();
        }

        // Listen for Calendly events
        window.addEventListener('calendly.event_scheduled', (e) => {
            this.hasScheduledMeeting = true;
            this.addMessage("Great! I see you've scheduled a meeting. Is there anything else I can help you with?", 'bot');
        });
    }
}

// Initialize the chatbot when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
}); 