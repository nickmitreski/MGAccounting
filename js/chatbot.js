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
        
        try {
            console.log('Sending request to backend API endpoint...');
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            console.log('Response status from backend:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Backend API Error Response:', errorText);
                throw new Error(`Backend API request failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log('Backend API Response:', data);

            if (!data.text) {
                 console.error('No text field in backend response:', data);
                 return this.getDefaultResponse();
            }

            return data.text;
        } catch (error) {
            console.error('Detailed error in getAIResponse (calling backend):', {
                error: error,
                message: error.message,
                stack: error.stack
            });
            
            return this.getDefaultResponse(error);
        }
    }

    getDefaultResponse(error = null) {
        const responses = [
            "I seem to be having a little trouble connecting right now. Could you please try your question again in a moment?",
            "Apologies, I hit a small snag. Please ask again, and I'll do my best to help.",
            "Something went wrong on my end. Can you rephrase your question or try again shortly?",
            "Hmm, I'm not quite sure how to respond to that due to a temporary issue. Could you try asking differently?"
        ];
        
        if (error) {
            console.error('Using default response due to error:', error);
        }
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    createPrompt(message, context) {
        // Updated Prompt: More detailed persona, conversational style, accounting focus
        return `You are 'MG Assistant', a friendly and knowledgeable virtual assistant for MG Accounting. 
Act like a helpful human accounting specialist based in our Oakleigh office. Be conversational, empathetic, and professional. 
Your primary goal is to answer user questions about Australian tax and accounting, explain our services, and assist users where possible. If a question is complex or requires personalized advice, gently guide them towards scheduling a consultation.

Key Information:
- Firm: MG Accounting
- Location: ${context.location} (${context.contact.address})
- Services: ${context.services.join(', ')}
- Contact: Phone ${context.contact.phone}, Email ${context.contact.email}
- Tone: Warm, approachable, expert, clear, concise. Avoid overly technical jargon unless explaining a concept. Use 'we' to refer to MG Accounting.
- Goal: Help users, provide accurate information based on general Australian accounting principles, and encourage consultation for specific advice.

Conversation History (Last 4 exchanges):
${this.conversationHistory.slice(-4).map(msg => `${msg.role === 'user' ? 'Client' : 'Assistant'}: ${msg.content}`).join('\n')}

Current User Query:
Client: ${message}

Your Response (as MG Assistant):`;
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