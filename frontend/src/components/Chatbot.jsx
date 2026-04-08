import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function Chatbot() {
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPlan, setAiPlan] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setAiPlan('');
    setError('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/ai/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ goal })
      });

      const data = await response.json();
      
      if (response.ok) {
        setAiPlan(data.plan);
        setError('');
      } else if (response.status === 503) {
        setError('🔄 AI service is temporarily busy. Please try again in a moment...');
        console.warn('Service temporarily unavailable, will retry');
      } else {
        setError(data.message || 'Failed to generate plan');
      }
    } catch (error) {
      console.error("Error generating plan: ", error);
      setError('⚠️ Connection error. Please check your internet and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById('pdf-content');
    
    const opt = {
      margin:       10,
      filename:     'My_7_Day_Fitness_Plan.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-header bg-dark text-white fw-bold">
        🤖 AI 7-Day Plan Generator
      </div>
      
      <div className="card-body d-flex flex-column" style={{ overflowY: 'auto' }}>
        <p className="text-muted mb-4">
          Tell AI your fitness goal (e.g., "Lose 5kg in 2 months", "Gain muscle for a marathon"), and get a custom 30-day diet and workout PDF!
        </p>

        <form onSubmit={handleGenerate} className="mb-4">
          <div className="input-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="What is your fitness goal?" 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
            <button className="btn btn-primary fw-bold" type="submit" disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Plan'}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-warning alert-dismissible fade show" role="alert">
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError('')}
            ></button>
          </div>
        )}

        {isGenerating && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <p className="fw-bold text-primary">AI is analyzing your goal and creating a custom plan...</p>
          </div>
        )}
        
        {aiPlan && !isGenerating && (
          <div className="border rounded p-4 bg-light flex-grow-1 position-relative mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <h5 className="text-success fw-bold mb-0">Plan Generated!</h5>
                <button 
                  onClick={downloadPDF} 
                  className="btn btn-danger btn-sm fw-bold shadow-sm"
                >
                  📄 Download PDF
                </button>
            </div>
            <div 
              id="pdf-content" 
              className="p-3 bg-white rounded shadow-sm"
              style={{ minHeight: '300px' }}
              dangerouslySetInnerHTML={{ __html: aiPlan }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}