import React, { useState } from 'react';
import './index.css'; // Changed from './App.css'

// Sample data (replace with a real database or API later)
const tireData: Record<string, { factory: string; largest: string }> = {
  '2012 nissan altima': {
    factory: '215/60R16 (16-inch wheels, 6.5J width, 5x114.3 PCD, 40mm offset)',
    largest: '235/45R18 (18-inch wheels, 8J width, 5x114.3 PCD, 35-40mm offset)',
  },
  // Add more vehicle data here
};

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ factory: string; largest: string } | null>(null);

  const handleSubmit = () => {
    const normalizedInput = input.toLowerCase().trim();
    const result = tireData[normalizedInput] || {
      factory: 'Not found. Please enter a valid vehicle (e.g., "2012 Nissan Altima").',
      largest: 'N/A',
    };
    setOutput(result);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>RIDE with SHANE</h1>
        <p>Tire & Wheel Expert</p>
      </header>
      <main className="main-content">
        <p className="welcome-text">
          Welcome to RIDE with SHANE Tire and Wheel Expert. Enter your vehicle info (e.g., '2012 Nissan Altima') to get factory tire and wheel specs, plus the largest wheel and tire combo that fits without modifications.
        </p>
        <textarea
          className="prompt-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your vehicle (e.g., '2012 Nissan Altima')"
        />
        <button className="submit-btn" onClick={handleSubmit}>
          Get Tire & Wheel Info
        </button>
        {output && (
          <div className="output-box">
            <h2>Shane’s Expertise:</h2>
            <p><strong>Factory Specs:</strong> {output.factory}</p>
            <p><strong>Largest Fit:</strong> {output.largest}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
