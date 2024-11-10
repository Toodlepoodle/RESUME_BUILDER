const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function sendChatMessage(message, conversationHistory) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      conversationHistory,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}

export async function generateResume(conversationHistory) {
  const response = await fetch(`${API_URL}/api/generate-resume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversationHistory,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate resume');
  }

  return response.json();
}
