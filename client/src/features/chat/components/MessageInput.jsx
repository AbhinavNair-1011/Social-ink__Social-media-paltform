import { useState } from "react";

import Button from "../../../shared/components/Button";

import { useCreateMessage } from "../hooks/useCreateMessage";

function MessageInput({ conversationId }) {
  const [text, setText] = useState("");

  const { mutate, isPending } = useCreateMessage();

  function handleSubmit(e) {
    e.preventDefault();

    const value = text.trim();

    if (!value) {
      return;
    }

    mutate(
      {
        conversationId,
        text: value,
        imageUrl: "",
      },
      {
        onSuccess: () => {
          setText("");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 border-slate-100 bg-slate-50  p-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-xl border  bg-slate-10  0 px-4 py-2 outline-none focus:border-blue-500"
      />

      <Button type="submit" disabled={isPending}>
        Send
      </Button>
    </form>
  );
}

export default MessageInput;
