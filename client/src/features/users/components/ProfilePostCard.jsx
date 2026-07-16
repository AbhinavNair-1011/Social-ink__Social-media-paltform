  import { useState } from "react";

  import EditPostForm from "../../posts/components/EditPostForm";
  import PostContent from "../../posts/components/PostContent";
  import PostActions from "../../posts/components/PostActions";
  import CommentList from "../../comments/components/CommentList";
  import { useQueryClient } from "@tanstack/react-query";
  import PostMenu from "../../posts/components/PostMenu";
  import Modal from "../../../shared/components/Modal";
  import PostModal from "../../posts/components/PostModal";

  function ProfilePostCard({ post, querykey }) {
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPost, setShowPost] = useState(false);
    const queryClient = useQueryClient();

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md p-4  " >
        <div   
        className="flex flex-col   justify-between h-full relative  "  >
          <div className=" absolute top-0 right-0 " >
            {post.isOwner && (
              <PostMenu
                post={post}
                setIsEditing={setIsEditing}
                querykey={querykey}
              />
            )}
          </div>
          <div className=" ">
            {isEditing ? (
              <EditPostForm post={post} setIsEditing={setIsEditing} querykey={querykey} />
            ) : (
              <>
                {post.imageUrl && (
                  <img
                  onClick={()=>setShowPost(true)}
                    src={post.imageUrl}
                    alt="Post"
                    className="mb-3 h-48 w-full rounded-lg object-fill"
                  />
                )}

                <PostContent  onClick={()=>setShowPost(true)} content={post.content} />
              </>
            )}
          </div>

          <PostActions
            post={post}
            showComments={showComments}
            setShowComments={()=>setShowPost(true)}
            setIsEditing={setIsEditing}
            onLikeSuccess={() =>
              queryClient.invalidateQueries({
                querykey,
              })
            }
            onDeleteSuccess={() =>
              queryClient.invalidateQueries({
                querykey,
              })
            }
          />
          {showPost && (
            <PostModal
              post={post}
              querykey={querykey}
              onClose={() => setShowPost(false)}
            />
          )}
        </div>
      </div>
    );
  }

  export default ProfilePostCard;
