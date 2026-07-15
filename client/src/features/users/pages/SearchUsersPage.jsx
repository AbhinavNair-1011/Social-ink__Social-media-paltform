import { useState } from "react";
import { Link } from "react-router-dom";

import Input from "../../../shared/components/Input";
import Loader from "../../../shared/components/Loader";
import EmptyState from "../../../shared/components/EmptyState";

import UserCard from "../components/UserCard";

import { useSearchUsers } from "../hooks/useSearchUsers";

function SearchUsersPage() {
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useSearchUsers(search);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Users</h1>

        <p className="mt-2 text-slate-500">
          Find people by their name or username.
        </p>
      </div>

      <Input
        id="search"
        label="Search"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading && <Loader />}

      {!isLoading && search && users.length === 0 && (
        <EmptyState title="No users found" description="Try another search." />
      )}

      <div className="space-y-3">
        {users.map((user) => (
            <UserCard user={user} />
        ))}
      </div>
    </div>
  );
}

export default SearchUsersPage;
