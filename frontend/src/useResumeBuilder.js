import { useState } from 'react';
import { generateResume, sendChatMessage } from '../utils/api';

export function useResumeBuilder() {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUserMessage = async (message) => {
    try {
      setLoading(true);
      setError(null);

      const response = await sendChatMessage(message, conversationHistory);
      
      setConversationHistory(prev => [
        ...prev,
        {
          question: message,
          response: response.response
        }
      ]);

    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await generateResume(conversationHistory);
      setResumeData(JSON.parse(response));

    } catch (err) {
      setError('Failed to generate resume. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    conversationHistory,
    resumeData,
    loading,
    error,
    handleUserMessage,
    generateResume: handleGenerateResume,
  };
}
