import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';

export function Chat({ conversationHistory, onSendMessage, loading }) {
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  return (
    <div className="h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div>
          {conversationHistory.map((entry, index) => (
            <div key={index} className={`p-2 mb-2 ${entry.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <strong>{entry.role === 'user' ? 'You' : 'AI'}:</strong>
              <p>{entry.message}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex p-4 border-t">
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <Button type="submit" disabled={loading}>Send</Button>
      </form>
    </div>
  );
}
