import { useEffect, useMemo, useRef } from "react";
import { ArrowLeft } from "lucide-react";

import { useMe } from "../../auth/hooks/useMe";
import { useMessages } from "../hooks/useMessage";

import Avatar from "../../../shared/components/Avatar";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

function ChatWindow({ selectedConversation, onBack }) {
  const bottomRef = useRef(null);

  const { data: me } = useMe();

  const { data: messages = [], isPending } = useMessages(
    selectedConversation?._id,
  );

  const myId = me?.user?._id;

  const otherUser = useMemo(() => {
    if (!selectedConversation || !myId) return null;

    return selectedConversation.participants.find(
      (participant) => participant._id !== myId,
    );
  }, [selectedConversation, myId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!selectedConversation) {
    return (
      <section className="flex h-full flex-1 items-center justify-center bg-slate-100">
        <div className="px-6 text-center">
          <div className="mb-4 text-6xl">💬</div>

          <h2 className="text-2xl font-semibold text-slate-800">
            Your Messages
          </h2>

          <p className="mt-2 text-slate-500">
            Select a conversation from the left to start chatting.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-1 flex-col bg-slate-100">

      <header className="sticky top-0 z-10 flex items-center gap-3 border-slate-100 bg-slate-50 px-2 py-3 shadow-sm sm:px-6">
        <button
          onClick={onBack}
          className="rounded-full p-2 transition hover:bg-slate-100 md:hidden"
        >
          <ArrowLeft size={22} />
        </button>

        <Avatar
          src={otherUser?.profileImage}
          alt={otherUser?.name}
          className="h-11 w-11 flex-shrink-0"
        />

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-800">
            {otherUser?.name}
          </h2>

         
        </div>
      </header>


      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 md:px-6">
        {isPending ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-slate-500">Loading messages...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
              />
            ))}

            <div ref={bottomRef} />
          </div>
        )}
      </div>


      <div className=" bg-slate-50/90 p-3 sm:p-4">
        <MessageInput
          conversationId={selectedConversation._id}
        />
      </div>
    </section>
  );
}

export default ChatWindow;