import { useState, useRef, useEffect } from 'react';
import { sendChatRequest, endChat } from '@/axios/axios'; 

const ChatModal = ({ file, initialMessages, closeModal }) => {
  const [messages, setMessages] = useState(initialMessages || []);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !file) {
      alert("Mesaj ve dosya seçmelisiniz!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await sendChatRequest(file, message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: "user" },
        { text: response.response || "Yanıt alınamadı.", sender: "system" },
      ]);
      setMessage("");
    } catch (error) {
      console.error("Mesaj gönderim hatası:", error);
      alert("Mesaj gönderilemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseChat = async () => {
    if (!file) {
      alert("Dosya olmalı");
      return;
    }
  
    try {
      const response = await endChat(file);
      if (response?.message) {
        alert(response.message); 
        closeModal(); 
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Sohbet sonlandırılamadı:", error);
      alert("Sohbet sonlandırılamadı.");
    }
  };
  

  return (
    <dialog className="modal modal-open">
      <div className="modal-box w-full max-w-3xl h-full flex flex-col">
        <button
          className="btn btn-sm"
          onClick={handleCloseChat} 
        >
          KAPAT
        </button>
        <h3 className="text-xl font-bold mb-4">PDF-CHAT</h3>
        <div
          className="chat-container flex-grow overflow-y-auto p-4 bg-gray-100 rounded-lg"
          ref={chatContainerRef}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
            >
              <span className="message-label">
                {msg.sender === "user" ? "Kullanıcı:" : "Bot:"}
              </span>
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="loading-bars">
              <span className="loading loading-bars loading-md"></span>
            </div>
          )}
        </div>

        <div className="input-container flex items-center mt-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="input input-bordered w-3/5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn btn-primary ml-2" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ChatModal;
