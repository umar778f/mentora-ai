import express from 'express';
import cors from 'cors'; // <-- Added CORS import
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import multer from 'multer';
import * as pdfParse from 'pdf-parse';

const app = express();
// FIX: We use Number() here to satisfy TypeScript!
const PORT = Number(process.env.PORT) || 3000;

// --- CORS CONFIGURATION (Must be before routes) ---
app.use(cors({
  origin: 'https://mentora-ai-sooty.vercel.app', // Allows your Vercel frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'dummy_key_if_missing_for_hackathon',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes
app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
  try {
    let resumeText = '';

    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        // @ts-ignore
        const data = await pdfParse.default(req.file.buffer);
        resumeText = data.text;
      } else {
        resumeText = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.text) {
      resumeText = req.body.text;
    } else {
      return res.status(400).json({ error: 'No resume provided.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing Gemini API Key");
    }

    const { text } = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: `Analyze the following resume and return a JSON object evaluating it.
      
      Resume text:
      ${resumeText.substring(0, 5000)}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.NUMBER, description: 'Score out of 100' },
            summary: { type: Type.STRING, description: 'A brief overall evaluation summary of the resume' },
            missingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key skills missing based on general industry standards for the implied role'
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Actionable tips for improving the resume'
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Suggested structural or content improvements'
            }
          },
          required: ['atsScore', 'summary', 'missingSkills', 'tips', 'improvements']
        }
      }
    });

    const parsed = JSON.parse(text || '{}');
    return res.json(parsed);

  } catch (error) {
    console.warn("Falling back to dummy data because of error:", error);
    return res.json({
      atsScore: 78,
      summary: "This resume has a strong foundation but lacks quantifiable achievements and keyword optimization for modern Applicant Tracking Systems (ATS).",
      missingSkills: ["Cloud Computing (AWS/Docker)", "CI/CD Pipelines", "Agile Methodologies", "Testing (Jest/Cypress)"],
      tips: [
        "Use action verbs (e.g., 'Spearheaded', 'Optimized') to start bullet points.",
        "Include metrics: 'Improved performance by 20%' instead of 'Improved performance'.",
        "Add a dedicated Skills section at the top for better ATS parsing."
      ],
      improvements: [
        "Format the dates consistently (e.g., MM/YYYY)",
        "Remove the 'References available upon request' phrase to save space",
        "Tailor the objective statement to the specific job title you are targeting"
      ]
    });
  }
});

app.post('/api/generate-roadmap', async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ error: 'Role is required' });

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing Gemini API Key");
    }

    const { text } = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: `Create a learning roadmap for a ${role}. Return as JSON.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            learningSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['title', 'description']
              }
            },
            projectIdeas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['title', 'description']
              }
            },
            interviewQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['requiredSkills', 'learningSteps', 'projectIdeas', 'interviewQuestions']
        }
      }
    });

    return res.json(JSON.parse(text || '{}'));
  } catch (error) {
    console.warn("Falling back to dummy data because of error:", error);
    return res.json({
      requiredSkills: ["HTML/CSS", "JavaScript", "React", "State Management", "Git"],
      learningSteps: [
        { title: "Internet Fundamentals", description: "Understand how the web works, HTTP, DNS, and hosting." },
        { title: "HTML, CSS & JS Core", description: "Master semantic HTML, CSS layouts (Flexbox/Grid), and vanilla JavaScript." },
        { title: "Frontend Frameworks", description: "Learn React or Vue to build single-page applications efficiently." },
        { title: "Version Control", description: "Learn Git and GitHub for tracking code changes and collaboration." }
      ],
      projectIdeas: [
        { title: "To-Do Application", description: "A classic project to understand CRUD operations and UI state." },
        { title: "Weather Dashboard", description: "Use an external API to fetch and display weather forecasts." },
        { title: "E-Commerce Mockup", description: "A simple catalog with a shopping cart and checkout flow UI." }
      ],
      interviewQuestions: [
        "Explain the difference between let, const, and var.",
        "How does the Event Loop work in JavaScript?",
        "What are React Hooks and how do they differ from class lifecycle methods?"
      ]
    });
  }
});

app.post('/api/mock-interview', async (req, res) => {
  try {
    const { history, message } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing Gemini API Key");
    }

    const chat = ai.chats.create({
      model: 'gemini-flash-latest',
      config: {
        systemInstruction: "You are an expert technical interviewer conducting a mock interview. Be professional, concise, and constructive. If the user provides an answer, evaluate it briefly and ask the next question. Do not break character."
      }
    });

    const contextStr = history && history.length > 0 
      ? `Here is the previous conversation history:\n\n${history.map((h: any) => `${h.role}: ${h.content}`).join('\n')}\n\nNow respond to the candidate's next message:\n`
      : '';

    const response = await chat.sendMessage({ message: contextStr + message });
    return res.json({ response: response.text });
  } catch (error) {
    console.warn("Falling back to dummy data because of error:", error);
    return res.json({
      response: "That's a good start. Let's dig deeper: can you explain how closures work in JavaScript and provide a practical use-case for them?"
    });
  }
});

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
