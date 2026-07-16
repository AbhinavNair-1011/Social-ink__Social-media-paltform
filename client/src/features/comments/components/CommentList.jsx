import Loader from "../../../shared/components/Loader";

import { useComments } from "../hooks/useComments";

import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

function CommentList({ postId, querykey }) {
  const { data: comments, isLoading } = useComments(postId);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mt-5 space-y-3 ">
   
      <CommentForm postId={postId}  querykey={querykey}/>

      <div className="space-y-3 max-h-[450px]  overflow-x-scroll">
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
}

export default CommentList;
