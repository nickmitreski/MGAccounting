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

## Chatbot Tone & Customization
- The chatbot is now designed to give short, chatty, human-like replies using explicit example-driven prompts.
- To further adjust tone, edit the system prompt in `js/chatbot.js` and add/remove example exchanges.
- For even more control, you can:
  - Add more sample dialogues to the system prompt.
  - Specify a maximum number of sentences or words per reply.
  - Adjust the follow-up question style or frequency.
- For best results, always provide clear examples of the style you want in the system prompt.

## Latest Updates (March 2024)
- Enhanced chatbot with improved typing indicators and natural response timing
- Added topic detection system for better context awareness
- Optimized chat history storage with timestamps and topic tracking
- Updated system prompt for more professional and concise responses
- Improved service-specific guidelines and quote handling

## Chatbot Features
- Professional Australian tax and accounting assistance
- Topic-aware responses (Tax, Business, Superannuation, Bookkeeping, Payroll)
- Session-based memory for conversation context
- Natural typing indicators with response timing
- Service quote handling and MG Accounting information
- Calendly integration for meeting scheduling

## Deployment
The website is deployed on Vercel. To trigger a new deployment:
1. Make changes to the codebase
2. Commit and push to GitHub
3. Vercel will automatically deploy the changes
4. If manual deployment is needed, use the Vercel dashboard

## Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Access the site at `http://localhost:3000`

## Environment Variables
Required environment variables:
- `MISTRAL_API_KEY`: Your Mistral AI API key
- `NEXT_PUBLIC_SITE_URL`: Your site's URL

## Contact
For support or questions, contact:
- Email: info@mgaccounting.com.au
- Phone: (03) 9563 4666

---

*Created by Flash Forward Digital for MG Accounting.* 