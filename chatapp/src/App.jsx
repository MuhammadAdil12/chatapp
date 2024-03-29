import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';

import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyBGhfAlAAXabWkA8HPaKfHTfB2BfZ7sAmA",
  authDomain: "chatapp-bef75.firebaseapp.com",
  projectId: "chatapp-bef75",
  storageBucket: "chatapp-bef75.appspot.com",
  messagingSenderId: "509030198197",
  appId: "1:509030198197:web:29b69f5e15de27bdadc7fc"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function App() {
  const [myName, setMyName] = useState('');
  const [mess, setMess] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = ref(database, 'messages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
    });
  }, [database]);

  const sendMessage = (event) => {
    event.preventDefault();

    if(myName === "" || mess === ''){
      alert("please make sure that the inputs are not empty")
    }else{

    const newMessageRef = push(ref(database, 'messages'));
    set(newMessageRef, {
      "sender": myName,
      "message": mess,
      "createdAt": Date.now()
    });
  }
    setMess('');
    return false;
  };

  return (
    <div>
      <form onSubmit={sendMessage}>
        <input type="text" placeholder="Enter your Name" value={myName} onChange={(e) => setMyName(e.target.value)} />
        <input type="text" id="message" placeholder="Enter messages here" value={mess} onChange={(e) => setMess(e.target.value)} />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.sender}: {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
