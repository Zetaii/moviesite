"use client"
import React, { useState } from "react"

const ChatbotPage = () => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you find movies today?" },
  ])

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", text: input }])

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: input },
        { sender: "bot", text: "This is a dummy response from the chatbot." },
      ])
      setInput("")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        Chat with MovieBot
      </h1>
      <div className="bg-slate-500 shadow-md rounded-lg  overflow-hidden">
        <div className="p-4 h-96 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`inline-block p-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.text}
              </p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatbotPage
