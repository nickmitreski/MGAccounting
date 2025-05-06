# MG Accounting Website

This is the official website for MG Accounting, a professional tax accounting and business advisory firm based in Oakleigh, Melbourne.

## Features
- Modern responsive design
- Services overview (Tax Planning, Business Advisory, Bookkeeping, SMSF, Wealth Management, Business Structuring)
- Interactive tax calculator (2025 Individual Tax Return Estimator)
- Client industry showcase
- Contact form and business information
- **Integrated chatbot assistant powered by Mistral LLM API**
- Side navigation menu for mobile and desktop

## Technologies Used
- HTML5, CSS3, JavaScript (ES6)
- Bootstrap, Font Awesome, Animate.css
- jQuery, Owl Carousel, Swiper, Magnific Popup
- Revolution Slider
- Custom chatbot integration
- **Vercel serverless functions for secure API proxy**

## Chatbot Architecture
- The chatbot UI is implemented in `js/chatbot.js` and styled with `css/chatbot.css`.
- All LLM API calls are securely proxied through `/api/chatbot.js` (a Vercel serverless function), which reads the Mistral API key from environment variables and never exposes it to the frontend.
- The chatbot uses a knowledge base (`knowledge_base.txt`) for context but provides short, conversational, human-like answers and follow-up questions.
- For complex or tax-specific queries, the bot suggests contacting MG Accounting directly.

### Customizing Chatbot Behavior
- Edit the system prompt in `js/chatbot.js` to adjust tone, length, or follow-up behavior.
- Update `knowledge_base.txt` to change the information available to the chatbot.

## Environment Variables
- Set `MISTRAL_API_KEY` in your Vercel (or local) environment for secure LLM access.

## Getting Started
1. **Clone the repository:**
   ```bash
   git clone https://github.com/nickmitreski/MGAccounting.git
   cd MGAccounting
   ```
2. **Install dependencies (if using Vercel serverless locally):**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - On Vercel: Add `MISTRAL_API_KEY` in your project settings.
   - Locally: Create a `.env` file with `MISTRAL_API_KEY=your_key_here`.
4. **Deploy:**
   - Push to GitHub and connect to Vercel for automatic deployment.

## Deployment Notes
- The chatbot will not function unless the Mistral API key is set in the environment.
- All API calls are routed through `/api/chatbot` for security.

## Contact
- **Website:** [mgaccounting.com.au](https://www.mgaccounting.com.au)
- **Email:** info@mgaccounting.com.au
- **Phone:** (03) 9563 4666

---

*Created by Flash Forward Digital for MG Accounting.* 