import Avatar from "../../../shared/components/Avatar";
import Button from "../../../shared/components/Button";
import { useRef } from "react";

function ProfileHeader({ user, onEdit, onImageChange, children }) {
  const inputRef = useRef(null);
  const dob = new Date(user.dob);

  const isValidDate = !Number.isNaN(dob.getTime());

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-24 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600" />

      <div className="px-2 md:px-6 pb-6">
        <div className="-mt-24 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex justify-start items-end gap-4">
            <div className="relative">
              <Avatar
                src={user.profileImage}
                classname="h-30 w-30 rounded-full border-4 border-white bg-white shadow-md"
              />

              <button
                type="button"
                onClick={() => inputRef.current.click()}
                className="absolute bottom-0 right-0 rounded-full bg-slate-600 px-2 py-1 text-xs text-white hover:bg-indigo-400"
              >
                Edit
              </button>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onImageChange(e.target.files?.[0])}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>

              <p className="text-md mt-1 text-slate-500">@{user.userName}</p>
            </div>
          </div>

          {children || (
            <Button onClick={onEdit} className="w-full sm:w-auto px-5 py-2">
              Edit Profile
            </Button>
          )}
        </div>

        <p className="mt-5 ml-2 text-slate-700 leading-6">
          {user.bio || "Tell people a little about yourself."}
        </p>

        <div className="mt-7 flex flex-wrap gap-3 text-[11px] md:text-sm text-slate-700 justify-start">
          {user.email && (
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {user.email}
            </span>
          )}

          <span className="rounded-full bg-slate-100 px-3 py-1">
            Date of Birth: {isValidDate ? dob.toLocaleDateString() : "Not set"}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1">
            Joined on {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
