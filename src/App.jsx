import { useState } from 'react';
import './App.css';
import Send from './assets/send.svg';
import Profile from './assets/profile.svg';
import Chatbot from './assets/chatbot.svg';

function App() {
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = e.target.health.value;

    const newUserMessage = {
      text: userMessage,
      sender: 'user',
      time: getCurrentTime(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    try {
      const response = await fetch('http://gbolahankay.pythonanywhere.com/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();

      const newBotMessage = {
        text: result.response,
        sender: 'bot',
        time: getCurrentTime(),
      };

      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    } catch (error) {
      console.error('Error:', error);
    }

    e.target.health.value = '';
  };


  const getCurrentTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <section>
      <h3>eHealth4Everyone chatBot</h3>
      <div className='mainWrapper'>
        <div className='interactions'>
          {messages.map((message, index) => (
            <div
              className={message.sender === 'user' ? 'userMessage' : 'botMessage'}
              key={index}
            >
              {message.sender === 'user' ? (
                <div className='userMessage'>
                  <div className='userMessageInner'>
                    <p>{message.text}</p>
                    <div className='smallText'>
                      <small>{message.time}</small>
                    </div>
                  </div>
                  <img src={Profile} />
                </div>
              ) : (
                <>
                  <img src={Chatbot} alt='Bot Avatar' />
                  <div className='botMessageInner'>
                    <p>{message.text}</p>
                    <div className='smallText'>
                      <small>{message.time}</small>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className='mainForm'>
          <input
            name='health'
            type='text'
            placeholder='Ask me anything...'
          />
          <button type='submit' className='sendBtn'>
            <img src={Send} alt='Send Button' />
          </button>
        </form>
      </div>
    </section>
  );
}

export default App;