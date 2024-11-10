import { useState } from 'react';
import axios from 'axios';

export function useResumeBuilder() {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUserMessage = async (message) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/chat', {
        previousResponses: conversationHistory,
        currentQuestion: message,
      });
      const aiMessage = response.data.response;
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', message },
        { role: 'ai', message: aiMessage },
      ]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const generateResume = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/generate-resume', {
        conversationHistory,
      });
      setResumeData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    conversationHistory,
    resumeData,
    loading,
    error,
    handleUserMessage,
    generateResume,
  };
}
