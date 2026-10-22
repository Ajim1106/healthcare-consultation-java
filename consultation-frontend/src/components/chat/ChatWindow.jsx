import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';
import '../../assets/styles/custom.css';

const ChatWindow = ({ appointmentId, appointment }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [appointmentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await apiService.getMessages(appointmentId);
      console.log('📨 Fetched messages:', response);
      setMessages(response);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const messageData = {
        SenderID: user.role === 'patient' ? user.PatientID : user.DoctorID,
        SenderType: user.role === 'patient' ? 'Patient' : 'Doctor',
        ReceiverID: user.role === 'patient' ? appointment.DoctorID : appointment.PatientID,
        ReceiverType: user.role === 'patient' ? 'Doctor' : 'Patient',
        AppointmentID: appointmentId,
        Content: newMessage.trim()
      };

      await apiService.sendMessage(messageData);
      setNewMessage('');
      await fetchMessages(); // Refresh messages
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Invalid timestamp:', timestamp);
      return '';
    }
  };

  const isCurrentUser = (message) => {
    // Use senderType instead of senderID since IDs are not working properly
    const messageSenderType = message.senderType || message.SenderType;
    const currentUserType = user.role === 'patient' ? 'Patient' : 'Doctor';

    console.log('🔍 User Type Debug:', {
      messageSenderType,
      currentUserType,
      userRole: user.role,
      isCurrentUser: messageSenderType === currentUserType
    });

    return messageSenderType === currentUserType;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* Messages Area */}
      <div className="messages-area flex-grow-1 overflow-auto p-3" style={{ height: '500px' }}>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {messages.length === 0 ? (
          <div className="text-center py-4">
            <div className="mb-3" style={{ fontSize: '2rem' }}>💬</div>
            <p className="text-muted">Start your consultation...</p>
          </div>
        ) : (
          messages.map((message, index) => {
            console.log('💬 Rendering message:', message);
            return (
              <div key={message.messageID || message.MessageID || `message-${index}`} className={`mb-3 ${isCurrentUser(message) ? 'text-end' : 'text-start'}`}>
                <div className={`message-bubble d-inline-block p-2 rounded ${
                  isCurrentUser(message)
                    ? 'bg-primary text-white'
                    : 'bg-light text-dark'
                }`} style={{ maxWidth: '70%' }}>
                  <div className="message-content">
                    <p className="mb-1">{message.content || message.Content}</p>
                    <small className={`${isCurrentUser(message) ? 'text-white-50' : 'text-muted'}`}>
                      {formatTime(message.timestamp || message.Timestamp)}
                    </small>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="message-input p-3 border-top">
        <Form onSubmit={handleSendMessage}>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!newMessage.trim() || sending}
            >
              {sending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChatWindow;