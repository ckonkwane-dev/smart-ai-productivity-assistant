# AI Workplace Productivity Assistant

## Project Overview
The AI Workplace Productivity Assistant is a modern, responsive web application designed to help professionals automate everyday workplace tasks. Built as a single, integrated dashboard, it leverages AI to streamline email writing, meeting summarization, task planning, and research. 

**Live App:** [https://smart-ai-productivity-assistant.lovable.app](https://smart-ai-productivity-assistant.lovable.app)

## Features Implemented
The application includes the following AI-powered features accessible via a sidebar navigation:
- ✅ **Smart Email Generator:** Generate professional emails with adjustable tones (Formal, Friendly, Persuasive, Apologetic, Direct).
- ✅ **Meeting Notes Summarizer:** Extract action items, decisions, and deadlines from raw meeting notes.
- ✅ **AI Task Planner:** Generate prioritized daily or weekly schedules.
- ✅ **AI Research Assistant:** Summarize topics or articles and provide key insights.
- ✅ **AI Chatbot Interface:** An interactive AI workplace assistant for general queries (requires sign-in to save chat history securely).

## Technologies and Tools Used
- **Lovable AI:** For generating the frontend UI, dashboard layout, and integrating AI functionality.
- **Tailwind CSS & shadcn/ui:** For a modern, SaaS-style, responsive design.
- **GitHub:** For version control and repository management.
- **Supabase:** For secure user authentication (Google and Email sign-in) and database storage for the Chatbot.

## Prompt Engineering Strategy
The application uses structured prompts to ensure high-quality, consistent AI outputs. Below is an example of the prompt structure used for the Smart Email Generator:

**Role:** Expert AI email writing assistant.
**Inputs:** Recipient, Purpose, Key Points, Desired Tone.
**Instructions:**
1. Generate a complete email with a clear subject line.
2. Use the specified tone consistently throughout the email.
3. Ensure all key points are woven into the email naturally.
4. Conclude with a polite and appropriate sign-off.

## Challenges and Solutions
**Challenge:** Configuring the local development environment (Node.js/npm) on Windows.
**Solution:** Researched and resolved PowerShell execution policy restrictions and installed the necessary Node.js runtimes to ensure the project could be run locally.

**Challenge:** Ensuring Chatbot conversation privacy and continuity.
**Solution:** Implemented a sign-in requirement (Google/Email) so chat history is saved securely to the user's account, with a "Clear chat" option available for privacy.

**Challenge:** Google Sign-In authentication error.
**Solution:** Debugged the authentication flow with Lovable AI and enabled clear error messaging on-screen to ensure successful user login.

## Responsible AI Disclaimer
This application uses AI to generate content. AI-generated responses can be inaccurate, incomplete, or biased. Always review and verify all information before use in a professional environment. Do not input confidential, proprietary, or personal information into the AI tools. Users are encouraged to treat AI outputs as a first draft rather than a final product.

## Setup Instructions (Local Development)
To run this project locally, you need Node.js and npm installed.

1. Clone the repository:
   ```sh
   git clone https://github.com/ckonkwane-dev/smart-ai-productivity-assistant.git
   ## Testing and Documentation
Detailed testing evidence, including Lovable AI chat logs, feature outputs (Meeting Summarizer, Task Planner, Research Assistant, Chatbot), and sign-in authentication screenshots, can be found in the project documentation:

- [View Project Testing Document](./Loveable%20chat%20logs%20and%20Function%20test.docx)
