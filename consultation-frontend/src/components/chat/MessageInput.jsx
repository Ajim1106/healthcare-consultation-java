import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import '../../assets/styles/custom.css';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
    } catch (err) {
      console.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={sending}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!message.trim() || sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default MessageInput;