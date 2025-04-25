import React, { useEffect, useState } from "react";

const Chat = () => {
  const [data, setData] = useState([]);
  const [selectedChat, setSelectedChat] = useState(false);
  const [countMembers, setCountMembers] = useState(null);
  const [msg, setMsg] = useState("");
  const me = "agent@mail.com";

  useEffect(() => {
    fetch("/chat_response.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data.results);
        setSelectedChat(data.results[0]);
      })
      .catch((err) => console.log("error fetching data", err));
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const memberCount = selectedChat.room.participant.length;
      setCountMembers(memberCount);
    }
  }, [selectedChat]);

  const sendMessageHandler = () => {
    const newMsg = {
      sender: me,
      type: "text",
      id: 1,
      message: msg,
    };
    const newSelectedChat = {
      ...selectedChat,
      comments: selectedChat.comments.concat([newMsg]),
    };
    setSelectedChat(newSelectedChat);
    setMsg("");
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <ul>
          {data &&
            data.map((item) => (
              <li className="mb-3 cursor-pointer font-medium text-blue-600">
                {item.room.name}
              </li>
            ))}
        </ul>
      </div>
      <main className="flex-1 flex flex-col">
        <div className="bg-white shadow px-4 py-3 flex items-center">
          <img
            src={selectedChat && selectedChat.room.image_url}
            alt="Group"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h2 className="text-lg font-semibold">
              {selectedChat && selectedChat.room.name}
            </h2>
            <p className="text-sm text-gray-500">{countMembers} Members</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {selectedChat &&
            selectedChat?.comments.map((comment) => (
              <div
                key={comment.id}
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg w-fit ${
                  comment.sender === me
                    ? "bg-blue-600 text-white self-end ml-auto"
                    : "bg-white text-gray-800 shadow"
                }`}
              >
                {comment.sender !== me && (
                  <span className="block mb-2 text-sm text-lime-800">
                    {comment.sender}
                  </span>
                )}
                {comment.type === "image" && (
                  <img
                    src={comment.media_url}
                    alt="Sent media"
                    className="rounded-md max-w-full mt-1"
                  />
                )}
                {comment.type === "video" && (
                  <iframe
                    className="rounded-md max-w-full mt-1"
                    src={comment.media_url}
                    title="video"
                    frameborder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                )}
                {comment.type === "pdf" && (
                  <div>
                    <iframe
                      src={comment.media_url}
                      title="PDF preview"
                      className="w-full h-64"
                    ></iframe>
                    <a
                      href={comment.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline text-sm block mt-1"
                    >
                      Buka PDF
                    </a>
                  </div>
                )}
                {comment && (
                  <span className="block text-sm">{comment.message}</span>
                )}
              </div>
            ))}
        </div>
        <div className="p-4 bg-white border-t">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={msg}
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setMsg(e.target.value)}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
              onClick={sendMessageHandler}
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
