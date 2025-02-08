import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const handler: Handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ 
          error: 'Method not allowed',
          details: 'Only POST requests are allowed'
        })
      };
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Configuration error',
          details: 'OpenAI API key is not configured'
        })
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid request',
          details: 'Request body is empty'
        })
      };
    }

    const { text } = JSON.parse(event.body);
    if (!text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid request',
          details: 'Text field is required'
        })
      };
    }

    const prompt = `You are the Forensic AI Deception Analyzer. Analyze the following statement strictly following this format:

🎯 Deception Score: XX% (Highly Likely Truthful ✅ / Mostly Truthful 🙂 / Uncertain 🤔 / Likely Deceptive ⚠️ / Highly Likely Deceptive 🚩)

🔍 Key Indicators:
- Example: "I think I was home..."
- Reason: Shows uncertainty (hedging language).

❓ Suggested Follow-Up Questions:
- 🤔 “Can you confirm exactly where you were?”
- 📅 “What did you do right before that time?”
- 🗣️ “Did anyone see you or talk to you then?”

Analyze this statement: "${text}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert in deception detection."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      top_p: 0.2,
      max_tokens: 750,
      stop: ["---"]
    });

    if (!completion.choices?.[0]?.message?.content) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'API Error',
          details: 'Invalid response from OpenAI API'
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        analysis: completion.choices[0].message.content 
      })
    };
  } catch (error: any) {
    console.error('Server Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error',
        details: error.message || 'An unexpected error occurred'
      })
    };
  }
};
