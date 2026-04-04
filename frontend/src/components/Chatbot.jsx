import { useState } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am your AI Fitness Coach. Ask me anything about workouts, diet, or gym doubts!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    if (e) e.preventDefault(); 
    if (!input.trim()) return;
    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput(''); 
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: userMessage.text })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'ai', text: data.message || 'Server error.' }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Network error. Make sure the backend server is running!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-dark text-white fw-bold">
        🤖 AI Fitness Coach
      </div>
      <div className="card-body" style={{ height: '300px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
            <div 
              className={`p-3 rounded-3 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border shadow-sm'}`}
              style={{ maxWidth: '85%' }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-muted small ms-2 fst-italic">Coach is typing...</div>
        )}
      </div>
      <div className="card-footer bg-white">
        <form onSubmit={handleSend} className="d-flex">
          <input 
            type="text" 
            className="form-control me-2" 
            placeholder="Ask about a workout..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          <button type="submit" className="btn btn-primary fw-bold" disabled={isLoading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}