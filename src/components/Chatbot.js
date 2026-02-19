import React, { useState } from 'react';
import axios from 'axios';
import { FaComments, FaPaperPlane } from 'react-icons/fa';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('/chat', { message: userMsg.text });
      const botReply = res.data.reply || 'Sorry, no reply.';
      setMessages((m) => [...m, { id: Date.now() + 1, from: 'bot', text: botReply }]);
    } catch (err) {
      setMessages((m) => [...m, { id: Date.now() + 1, from: 'bot', text: 'Server error' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg z-50 flex items-center"
        aria-label="Open chat"
      >
        <FaComments />
      </button>

      {/* Chat box */}
      {open && (
        <div className="fixed bottom-20 right-6 w-96 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="font-semibold">Assistant</div>
            <button onClick={() => setOpen(false)} className="text-sm text-gray-500">Close</button>
          </div>

          <div className="p-4 h-64 overflow-y-auto space-y-3">
            {messages.length === 0 && <div className="text-sm text-gray-500">Say hi — I can help with menu, orders, and reviews.</div>}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-lg max-w-[80%] ${m.from === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex items-center space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="flex-1 input-field"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} disabled={loading} className="bg-primary text-white px-3 py-2 rounded">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
