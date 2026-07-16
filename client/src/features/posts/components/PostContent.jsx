function PostContent({ content, onClick, showPost }) {
  return (
    <p
      onClick={onClick}
      className={`mt-4 whitespace-pre-wrap break-words rounded-lg bg-slate-100 p-3 leading-7 ${
        showPost
          ? "min-h-[10px]"
          : "min-h-[50px] max-h-40 overflow-auto"
      }`}
    >
      {content}
    </p>
  );
}

export default PostContent;