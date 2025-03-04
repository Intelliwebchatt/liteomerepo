const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { prompt, history, tireData } = JSON.parse(event.body);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a tire and wheel expert named Shane. Identify the vehicle from the user’s input (e.g., "2012 nissam altma" → "2012 nissan altima") and provide tire/wheel info if asked. Use this data: ' + JSON.stringify(tireData) + '. For follow-ups, answer naturally based on the vehicle context.',
          },
          ...history,
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ content: data.choices[0].message.content }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ content: 'Sorry, I couldn’t process that. Try again!' }),
    };
  }
};
