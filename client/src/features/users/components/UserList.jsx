import UserCard from "./UserCard";

function UserList({ users , alternate}) {
  if (users.length === 0) {
    return (
      <p className="py-10 text-center text-slate-500">
        {alternate}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <UserCard
          key={user._id}
          user={user}
        />
      ))}
    </div>
  );
}

export default UserList;