import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import socket from "../../../app/socket";

import { useConversations } from "../hooks/useConversation";

import ConversationSidebar from "../components/ConversationSidebar";
import ChatWindow from "../components/ChatWindow";
import { useQueryClient } from "@tanstack/react-query";

function ChatPage() {
  const location = useLocation();

  const [selectedConversation, setSelectedConversation] = useState(
    location.state?.conversation || null,
  );

  const [showChat, setShowChat] = useState(!!location.state?.conversation);

  const { data: conversations = [], isPending } = useConversations();

  useEffect(() => {
    if (
      !selectedConversation &&
      conversations.length &&
      window.innerWidth >= 768
    ) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  useEffect(() => {
    if (!selectedConversation) return;

    socket.emit("join-conversation", selectedConversation._id);

    return () => {
      socket.emit("leave-conversation", selectedConversation._id);
    };
  }, [selectedConversation]);

  return (
    <div className="-m-4 md:-m-6">
      <div className="mx-auto flex h-[calc(100dvh-72px)] max-w-7xl overflow-hidden bg-white shadow-xl md:rounded-xl ">
        <div
          className={`
            h-full
            w-full
            md:block
            md:w-[340px]
            ${showChat ? "hidden" : "block"}
          `}
        >
          <ConversationSidebar
            conversations={conversations}
            isPending={isPending}
            selectedConversation={selectedConversation}
            setSelectedConversation={(conversation) => {
              setSelectedConversation(conversation);
              setShowChat(true);
            }}
          />
        </div>

        <div
          className={`
            h-full
            w-full
            flex-1
            ${showChat ? "block" : "hidden"}
            md:block
          `}
        >
          <ChatWindow
            selectedConversation={selectedConversation}
            onBack={() => setShowChat(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
