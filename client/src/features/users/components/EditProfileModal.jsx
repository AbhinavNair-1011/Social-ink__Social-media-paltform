import { useForm } from "react-hook-form";

import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { updateProfileSchema } from "../schemas/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";

function EditProfileModal({ user, onSave, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),

    defaultValues: {
      ...user,
      dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="text-2xl font-bold">Edit Profile</h2>

        <form onSubmit={handleSubmit(onSave)} className="mt-8 space-y-5">
          <Input
            id="name"
            label="Name"
            register={register("name")}
            error={errors.name}
          />

          <Input
            id="userName"
            label="Username"
            register={register("userName")}
            error={errors.userName}
          />

          <Input
            id="bio"
            label="Bio"
            register={register("bio")}
            error={errors.bio}
          />

          <Input
            id="dob"
            type="date"
            label="Date of Birth"
            register={register("dob")}
            error={errors.dob}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              className="bg-slate-200 text-slate-700 hover:bg-slate-300"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
