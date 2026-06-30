import { formatDistanceToNow } from "date-fns";

import Avatar from "../../../shared/components/Avatar";
import PostMenu from "./PostMenu";
function PostHeader({ post,setIsEditing }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar image={post.author.profileImage} />

        <div>
          <h2 className="font-semibold">{post.author.name}</h2>

          <p className="text-sm text-gray-500">@{post.author.userName}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          {formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
          })}
        </span>

        {post.isOwner && <PostMenu post={post} setIsEditing={setIsEditing} />}
      </div>
    </div>
  );
}

export default PostHeader;
