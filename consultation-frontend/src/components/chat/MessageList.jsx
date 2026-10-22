import React, { useEffect, useRef } from 'react';
import '../../assets/styles/custom.css';

const MessageList = ({ messages, currentUserId }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted">Start your conversation...</p>
        </div>
      ) : (
        messages.map(message => (
          <div key={message.MessageID} className="mb-3">
            <div className={`message-bubble ${
              message.SenderID === currentUserId
                ? 'message-sent'
                : 'message-received'
            }`}>
              <p className="mb-1">{message.Content}</p>
              <small className="opacity-75">
                {formatTime(message.Timestamp)}
              </small>
            </div>
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;