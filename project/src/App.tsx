import React, { useState } from 'react';
import { Brain, AlertTriangle, Loader2 } from 'lucide-react';

export default function App() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setError(null);
    setAnalysis(null);
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        let errorMessage = 'Server error occurred';
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.error && errorData.details) {
            errorMessage = `${errorData.error}: ${errorData.details}`;
          } else {
            errorMessage = errorData.details || errorData.error || `Server error (${response.status})`;
          }
        } catch {
          errorMessage = responseText || `Server error (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError, 'Response:', responseText);
        throw new Error('Failed to parse server response');
      }

      if (!data || !data.analysis) {
        console.error('Invalid response data:', data);
        throw new Error('Invalid response format from server');
      }

      setAnalysis(data.analysis);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Analysis failed:', { error: err, message: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-gray-400" />
            <span className="text-2xl font-bold text-gray-400">IntelliChatt</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <span className="text-xl font-bold text-red-600">LIE TO ME</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Message */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h1 className="text-2xl font-bold mb-4">Welcome to Lie To Me (Beta)</h1>
            <p className="text-gray-300">
              Using cutting-edge AI technology and scientific research in deception detection,
              this tool analyzes conversations and transcripts for potential deceptive patterns.
              For best results, provide longer messages or complete conversation transcripts.
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your conversation or transcript here..."
              className="w-full h-48 bg-gray-900 text-white border border-gray-800 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={analyzeText}
              disabled={loading || !text.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Analyze
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 p-6 rounded-lg border border-red-800 animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <span className="text-red-400 font-bold">Error:</span>
              </div>
              <p className="mt-2 text-red-300">{error}</p>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 animate-fadeIn">
              <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300">
                {analysis}
              </pre>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 p-4">
        <div className="container mx-auto text-center text-gray-500">
          <p>Advanced Deception Analysis Tool - For Research Purposes Only</p>
        </div>
      </footer>
    </div>
  );
}