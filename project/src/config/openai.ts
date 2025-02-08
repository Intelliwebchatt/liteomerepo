import OpenAI from 'openai';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Optionally set a custom base URL if needed
  baseURL: process.env.OPENAI_API_BASE_URL,
});

export const analyzeText = async (text: string) => {
  try {
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

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze text');
  }
};