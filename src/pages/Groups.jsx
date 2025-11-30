// src/pages/Groups.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGroups from "../hooks/useGroups";
import Modal from "../components/user/Modal";
import EmptyState from "../components/EmptyState";

export default function Groups() {
  const { user } = useAuth();
  const { myGroups, loading, createGroup, joinGroupByCode } = useGroups();

  const [openCreate, setOpenCreate] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleCreate = async () => {
    setError("");
    try {
      const id = await createGroup(groupName || "My Group");
      setGroupName("");
      setOpenCreate(false);
      navigate(`/groups/${id}`);
    } catch (err) {
      setError(err?.message || "Could not create group.");
    }
  };

  const handleJoin = async () => {
    setError("");
    try {
      const id = await joinGroupByCode(code);
      setCode("");
      setOpenJoin(false);
      navigate(`/groups/${id}`);
    } catch (err) {
      setError(err?.message || "Could not join group.");
    }
  };

  return (
    <section className="max-w-5xl mx-auto p-6 pt-20">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-1 text-violet">
          Groups
        </h1>
        <p className="subtle text-gray-700">
          Create or join a group to share goals and compete on a leaderboard.
        </p>
      </header>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => {
            setError("");
            setOpenCreate(true);
          }}
          className="btn btn-gradient rounded-full text-sm"
        >
          Create Group
        </button>
        <button
          type="button"
          onClick={() => {
            setError("");
            setOpenJoin(true);
          }}
          className="btn btn-ghost text-sm"
        >
          Join Group
        </button>
      </div>

      {/* Groups list / empty state */}
      {loading ? (
        <p className="subtle">Loading groups...</p>
      ) : myGroups?.length === 0 ? (
        <EmptyState
          title="No groups yet"
          subtitle="Create or join a group to get started."
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {myGroups.map((g) => (
            <li key={g.id} className="card flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {g.name}
                  </h2>
                  {g.adminUid === user?.uid && (
                    <span className="inline-flex items-center rounded-full bg-violet/10 text-violet px-2.5 py-0.5 text-xs font-semibold">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Members see shared goals and a group leaderboard.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <Link
                  to={`/groups/${g.id}`}
                  className="text-sm font-semibold text-violet hover:text-violet2"
                >
                  Open group →
                </Link>
                {g.code && (
                  <span className="inline-flex items-center rounded-full bg-rose2/40 px-2.5 py-0.5 text-[11px] font-medium text-red-500">
                    Code: {g.code}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Create Group Modal */}
      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Create a group"
      >
        {error && (
          <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group name
        </label>
        <input
          className="input"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Study Buddies"
        />

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setOpenCreate(false)}
            className="btn btn-ghost text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="btn btn-gradient text-sm"
          >
            Create
          </button>
        </div>
      </Modal>

      {/* Join Group Modal */}
      <Modal
        open={openJoin}
        onClose={() => setOpenJoin(false)}
        title="Join a group"
      >
        {error && (
          <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Invite code
        </label>
        <input
          className="input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ABC7KZ2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Ask your friend or teammate to share their group code.
        </p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setOpenJoin(false)}
            className="btn btn-ghost text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleJoin}
            className="btn btn-gradient text-sm"
          >
            Join
          </button>
        </div>
      </Modal>
    </section>
  );
}
