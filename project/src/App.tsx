import React, { useState } from 'react';
import './index.css';

// Sample tire data (expand this or replace with a database/API)
const tireData: Record<string, { factory: string; largest: string }> = {
  '2012 nissan altima': {
    factory: '215/60R16 (16-inch wheels, 6.5J width, 5x114.3 PCD, 40mm offset)',
    largest: '235/45R18 (18-inch wheels, 8J width, 5x114.3 PCD, 35-40mm offset)',
  },
  '2020 toyota camry': {
    factory: '205/65R16 (16-inch wheels, 6.5J width, 5x114.3 PCD, 40mm offset)',
    largest: '235/40R19 (19-inch wheels, 8J width, 5x114.3 PCD, 35mm offset)',
  },
};

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [vehicle, setVehicle] = useState<string | null>(null);

  const normalizeVehicle = (text: string) => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const callOpenAI = async (prompt: string, history: { role: string; content: string }[] = []) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // Use Netlify env var
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
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Error:', error);
      return 'Sorry, I couldn’t process that. Try again!';
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const newMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');

    const gptResponse = await callOpenAI(input, messages);

    // If no vehicle is set yet, try to extract it from GPT’s response
    if (!vehicle) {
      const normalizedResponse = normalizeVehicle(gptResponse);
      const matchedVehicle = Object.keys(tireData).find((key) =>
        normalizedResponse.includes(key)
      );
      if (matchedVehicle) setVehicle(matchedVehicle);
    }

    setMessages([...updatedMessages, { role: 'assistant', content: gptResponse }]);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>RIDE with SHANE</h1>
        <p>Tire & Wheel Expert</p>
      </header>
      <main className="main-content">
        <p className="welcome-text">
          Welcome to RIDE with SHANE Tire and Wheel Expert. Tell me about your vehicle (e.g., "2012 Nissan Altima") to get factory tire and wheel specs, plus the largest combo that fits without mods. Ask follow-ups too!
        </p>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
        <textarea
          className="prompt-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell Shane about your vehicle or ask a question (e.g., '2012 Nissan Altima' or 'What about off-road tires?')"
        />
        <button className="submit-btn" onClick={handleSubmit}>
          Talk to Shane
        </button>
      </main>
    </div>
  );
};

export default App;
