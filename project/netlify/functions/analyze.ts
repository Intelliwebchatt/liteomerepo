import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const handler: Handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    // Only allow POST requests
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

    // Check if API key is configured
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

    // Parse request body
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

    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid request',
          details: 'Invalid JSON in request body'
        })
      };
    }

    const { text } = parsedBody;
    
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in deception detection, analyzing text for signs of deception based on scientific research. Provide a detailed analysis with confidence levels and reasoning."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
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
    
    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      return {
        statusCode: error.status || 500,
        headers,
        body: JSON.stringify({ 
          error: 'OpenAI API Error',
          details: error.message || 'Unknown OpenAI API error'
        })
      };
    }
    
    // Handle all other errors
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error',
        details: error.message || 'An unexpected error occurred'
      })
    };
  }
}