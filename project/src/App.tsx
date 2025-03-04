import React, { useState } from 'react';
import './App.css'; // Assuming styles are moved here (or use index.css)

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState<any>(null);

  const handleSubmit = async () => {
    // Placeholder for your existing OpenAI API call
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY_HERE', // Replace with your key
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      setOutput(data.choices[0].message.content); // Structured output
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      setOutput('Sorry, something went wrong. Try again!');
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>RIDE with SHANE</h1>
        <p>Tire & Wheel Expert</p>
import React, { useState } from 'react';
import './App.css'; // Assuming styles are moved here (or use index.css)

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState<any>(null);

  const handleSubmit = async () => {
    // Placeholder for your existing OpenAI API call
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY_HERE', // Replace with your key
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      setOutput(data.choices[0].message.content); // Structured output
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      setOutput('Sorry, something went wrong. Try again!');
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>RIDE with SHANE</h1>
        <p>Tire & Wheel Expert</p>
      </header>
      <main className="main-content">
        <textarea
          className="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Shane about tires or wheels (e.g., 'Best tires for my SUV?')"
        />
        <button className="submit-btn" onClick={handleSubmit}>
          Get Shane’s Advice
        </button>
        {output && (
          <div className="output-box">
            <h2>Shane’s Expertise:</h2>
            <pre>{typeof output === 'string' ? output : JSON.stringify(output, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;      </header>
      <main className="main-content">
        <textarea
          className="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Shane about tires or wheels (e.g., 'Best tires for my SUV?')"
        />
        <button className="submit-btn" onClick={handleSubmit}>
          Get Shane’s Advice
        </button>
        {output && (
          <div className="output-box">
            <h2>Shane’s Expertise:</h2>
            <pre>{typeof output === 'string' ? output : JSON.stringify(output, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
