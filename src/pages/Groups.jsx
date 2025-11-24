import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGroups from "../hooks/useGroups";
import Modal from "../components/user/Modal";
import EmptyState from "../components/EmptyState"; 

export default function Groups() {
  const { user } = useAuth();
  const {
    myGroups,
    loading,
    createGroup,
    joinGroupByCode,
  } = useGroups();
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
    <section className="">
      <header className="">
        <h1 className="">
          Groups
        </h1>
        <p className="">
          Create or join a group to share goals and compete on a leaderboard.
        </p>
      </header>

      <div className="">
        <button
          type="button"
          onClick={() => setOpenCreate(true)}
          className=""
        >
          Create Group
        </button>
        <button
          type="button"
          onClick={() => setOpenJoin(true)}
          className=""
        >
          Join Group
        </button>
      </div>

      {loading ? (
        <p className="">Loading your groups…</p>
      ) : myGroups.length === 0 ? (
        <EmptyState
          title="No groups yet"
          subtitle="Create or join a group to get started."
        /> 
      ) : (
        <ul className="">
          {myGroups.map((g) => (
            <li
              key={g.id}
              className=""
            >
              <div>
                <div className="">
                  <h2 className="">
                    {g.name}
                  </h2>
                  {g.adminUid === user?.uid && (
                    <span className="">
                      Admin
                    </span>
                  )}
                </div>
                <p className="">
                  Members see shared goals and a group leaderboard.
                </p>
              </div>
              <div className="">
                <Link
                  to={`/groups/${g.id}`}
                  className=""
                >
                  Open group →
                </Link>
                <span className="">
                  Code: <span className="">{g.code}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      
      <Modal
        open={openCreate}
        onClose={() => {
          setError("");
          setOpenCreate(false);
        }}
        title="Create a group"
      >
        {error && (
          <div className="">
            {error}
          </div>
        )}
        <label className="">
          Group name
        </label>
        <input
          className=""
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Study Buddies"
        />
        <div className="">
          <button
            type="button"
            onClick={() => setOpenCreate(false)}
            className=""
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className=""
          >
            Create
          </button>
        </div>
      </Modal>

      
      <Modal
        open={openJoin}
        onClose={() => {
          setError("");
          setOpenJoin(false);
        }}
        title="Join a group"
      >
        {error && (
          <div className="">
            {error}
          </div>
        )}
        <label className="">
          Invite code
        </label>
        <input
          className=""
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ABC7KZ2"
        />
        <p className="">
          Ask your friend or teammate to share their group code.
        </p>
        <div className="">
          <button
            type="button"
            onClick={() => setOpenJoin(false)}
            className=""
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleJoin}
            className=""
          >
            Join
          </button>
        </div>
      </Modal>
    </section>
  );
}
