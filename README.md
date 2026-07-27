# Diagram Tool - AI Diagram Generator

An AI-powered web application that transforms technical concepts into clear, interactive diagrams. Simply describe a programming or software engineering topic, and the application generates visual diagrams to make complex ideas easier to understand.

## ✨ Features

- AI-generated diagrams from natural language prompts
- Visualize software architecture and technical concepts
- Fast, responsive interface
- Clean and intuitive user experience
- Powered by Cloudflare Workers for edge computing

## 🚀 Live Demo

https://ai-design-tool.prakashakrakr.workers.dev/


## 📸 Screenshots

<img width="1920" height="946" alt="screencapture-ai-design-tool-prakashakrakr-workers-dev-2026-07-28-00_19_45" src="https://github.com/user-attachments/assets/c1d92047-1dc5-475e-a373-bb59f8c09724" />

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS

### Backend
- Cloudflare Workers
- OpenAI API

## 🧠 Example Prompts

- JavaScript Event Loop
- OAuth Authentication Flow

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/your-repository.git
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key
UPSTASH_VECTOR_REST_URL=your_upstash_vector_rest_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_vector_rest_token
```

If deploying to Cloudflare Workers, configure your secrets using Wrangler:

```bash
npx wrangler secret put OPENAI_API_KEY
```

## 🏗️ Build

```bash
npm run build
```

## 🚀 Deployment

This project is deployed using **Cloudflare Workers**.

Deploy with:

```bash
npm run deploy
```

or

```bash
npx wrangler deploy
```

## 📁 Project Structure

```
app/              # Next.js App Router
components/       # UI components
lib/              # Utility functions
public/           # Static assets
worker/           # Cloudflare Worker
```

## 🎯 Purpose

This project was built to help developers learn technical concepts through AI-generated visual diagrams, making abstract ideas easier to understand than text alone.

## 🔮 Future Improvements

- User authentication
- Diagram history
- Export as PNG/SVG/PDF
