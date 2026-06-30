import Loader from "../../../shared/components/Loader";

import { useComments } from "../hooks/useComments";

import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

function CommentList({ postId }) {
  const { data: comments, isLoading } = useComments(postId);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mt-5 space-y-3">
      <CommentForm postId={postId} />

      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} postId={postId} />
      ))}
    </div>
  );
}

export default CommentList;
