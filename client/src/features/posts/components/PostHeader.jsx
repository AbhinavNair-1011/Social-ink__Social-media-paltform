import { formatDistanceToNow } from "date-fns";
import {  useNavigate } from "react-router-dom";
import Avatar from "../../../shared/components/Avatar";
import PostMenu from "./PostMenu";
function PostHeader({ post,setIsEditing }) {

  const navigate= useNavigate()
  function handleClick(){

    navigate(`/users/${post.author._id}`)
    
  }
  return (
    <div className="mb-3 flex items-start justify-between bg-slate-50/50 p-1 rounded">
  <div className="flex items-center gap-3">
    <Avatar
      src={post.author.profileImage}
      className="h-11 w-11"
    />

    <div className="min-w-0">
      <div className="flex items-center gap-2 cursor-pointer"
      onClick={handleClick}>
        <h2 className="truncate text-[15px] font-semibold text-slate-900">
          {post.author.name}
        </h2>

        <span className="text-sm text-slate-400">•</span>

        <span className="truncate text-sm text-slate-500">
          @{post.author.userName}
        </span>
      </div>

      <p className="mt-0.5 text-xs text-slate-400">
        {formatDistanceToNow(new Date(post.createdAt), {
          addSuffix: true,
        })}
      </p>
    </div>
  </div>

  {post.isOwner && (
    <PostMenu
      post={post}
      setIsEditing={setIsEditing}
      querykey={["feed"]}
    />
  )}
</div>
  );
}

export default PostHeader;
