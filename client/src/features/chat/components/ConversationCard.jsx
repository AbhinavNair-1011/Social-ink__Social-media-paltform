import { format } from "date-fns";

import { useMe } from "../../auth/hooks/useMe";

import Avatar from "../../../shared/components/Avatar";

function ConversationCard({
  conversation,
  selectedConversation,
  setSelectedConversation,
}) {
  const { data: me } = useMe();

  const myId = me?.user?._id;

  const otherUser = conversation.participants.find(
    (participant) => participant._id.toString() !== myId?.toString(),
  );
  const isSelected = selectedConversation?._id === conversation._id;

  return (
    <button
      type="button"
      onClick={() => setSelectedConversation(conversation)}
      className={`w-full border-slate-100 px-4 py-3 transition-all duration-200 ${
        isSelected
          ? "border-l-4 border-l-blue-600 bg-blue-50"
          : "hover:bg-slate-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <Avatar
          src={otherUser.profileImage}
          alt={otherUser.name}
          className="h-12 w-12"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="truncate font-semibold text-slate-800">
              {otherUser.name}
            </h3>

            {conversation.lastMessageAt && (
              <span className="text-xs text-slate-500">
                {format(new Date(conversation.lastMessageAt), "hh:mm a")}
              </span>
            )}
          </div>

          <p className="truncate text-sm text-slate-500 text-start ">
            {conversation.lastMessage?.text || "Start chatting"}
          </p>
        </div>
      </div>
    </button>
  );
}

export default ConversationCard;
