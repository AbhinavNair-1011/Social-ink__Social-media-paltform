import ConversationCard from "./ConversationCard";

function ConversationSidebar({
  conversations,
  isPending,
  selectedConversation,
  setSelectedConversation,
}) {
  return (
    <aside className="flex h-full flex-col b bg-slate-50 ">
      <div className="border-slate-100 px-6 py-1  border ">
        <h1 className="text-2xl font-bold text-slate-800">Chats</h1>

        <p className="mt-1 text-sm text-slate-500">
          {conversations.length} Conversations
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isPending && (
          <div className="p-6 text-center text-slate-500">Loading...</div>
        )}

        {!isPending && conversations.length === 0 && (
          <div className="p-6 text-center text-slate-500">
            No conversations yet.
          </div>
        )}

        {!isPending &&
          conversations.map((conversation) => (
            <ConversationCard
              key={conversation._id}
              conversation={conversation}
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
            />
          ))}
      </div>
    </aside>
  );
}

export default ConversationSidebar;
