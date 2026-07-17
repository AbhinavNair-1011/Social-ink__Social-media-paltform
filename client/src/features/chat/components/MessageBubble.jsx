import { format } from "date-fns";

import { useMe } from "../../auth/hooks/useMe";

import Avatar from "../../../shared/components/Avatar";

function MessageBubble({ message }) {
  const { data: me } = useMe();

  const myId = me?.user?._id;

  const isMine = message.sender?._id?.toString() === myId?.toString();

  return (
    <div
      className={`mb-4 flex w-full ${isMine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""}`}
      >
        {!isMine && (
          <Avatar
            src={message.sender.profileImage}
            alt={message.sender.name}
            className="h-9 w-9 flex-shrink-0 self-start"
          />
        )}

        <div
          className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
        >
          <span className="mb-1 px-1 text-xs font-medium text-slate-500">
            {isMine ? "You" : message.sender.name}
          </span>

          <div
            className={`
              max-w-[260px]
              sm:max-w-[340px]
              md:max-w-[420px]
              lg:max-w-[520px]
              rounded-2xl
              px-4
              py-3
              shadow-sm
              break-words
              whitespace-pre-wrap
              ${
                isMine
                  ? "rounded-br-md bg-blue-600 text-white"
                  : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
              }
            `}
          >
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="Message"
                className="mb-3 max-h-72 w-full rounded-xl object-cover"
              />
            )}

            {message.text && (
              <p className="text-[15px] leading-6">{message.text}</p>
            )}
          </div>

          <span className="mt-1 px-1 text-[11px] text-slate-400">
            {format(new Date(message.createdAt), "hh:mm a")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
