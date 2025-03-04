import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler: Handler = async (event) => {
  const { prompt, history, tireData } = JSON.parse(event.body || '{}');

  if (!prompt || !tireData) {
    return {
      statusCode: 400,
      body: JSON.stringify({ content: 'Missing prompt or tire data' }),
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a tire and wheel expert named Shane. Identify the vehicle from the user’s input (e.g., "2012 nissam altma" → "2012 nissan altima") and provide tire/wheel info if asked. Use this data: ${JSON.stringify(tireData)}. For follow-ups, answer naturally based on the vehicle context.`,
        },
        ...(history || []),
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ content }),
    };
  } catch (error) {
    console.error('OpenAI Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ content: 'Sorry, I couldn’t process that. Try again!' }),
    };
  }
};
