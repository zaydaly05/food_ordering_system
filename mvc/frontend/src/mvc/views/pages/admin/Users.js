
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { USER_ROLES, useAuth } from "../../../models/context/AuthContext";


export default function AdminUsersPanel() {
  const { user, getAllUsers, createUserByAdmin, updateUserById, deleteUserById } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: USER_ROLES.CUSTOMER,
  });

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        setLoading(true);
        const dbUsers = await getAllUsers();
        if (!active) return;
        setUsers(
          dbUsers.map((u) => ({
            ...u,
            password: "",
          }))
        );
      } catch (err) {
        if (!active) return;
        toast.error("Failed to load users from database");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      active = false;
    };
  }, [getAllUsers]);

  const updateField = (targetId, key, value) => {
    setUsers((prev) =>
      prev.map((u) => (String(u.id) === String(targetId) ? { ...u, [key]: value } : u))
    );
  };

  const updateNewField = (key, value) => {
    setNewUser((prev) => ({ ...prev, [key]: value }));
  };

const handleCreate = async () => {
  if (!newUser.email.trim() || !newUser.password.trim()) {
    toast.error("Email and password are required");
    return;
  }

  // CHECK IF EMAIL EXISTS
  const emailExists = users.some(
    (u) => u.email.toLowerCase() === newUser.email.trim().toLowerCase()
  );

  if (emailExists) {
    toast.error("Email already exists");
    return;
  }

  try {
    setSavingUserId("new");

    const created = await createUserByAdmin({
      name: newUser.name || "",
      email: newUser.email || "",
      phone: newUser.phone || "",
      address: newUser.address || "",
      role: newUser.role || USER_ROLES.CUSTOMER,
      password: newUser.password,
    });

    setUsers((prev) => [{ ...created, password: "" }, ...prev]);

    setNewUser({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role: USER_ROLES.CUSTOMER,
    });

    toast.success("User created");
  } catch (err) {
    toast.error(err.message || "Failed to create user");
  } finally {
    setSavingUserId(null);
  }
};

const handleSave = async (targetUser) => {
  // CHECK IF EMAIL EXISTS FOR ANOTHER USER
  const emailExists = users.some(
    (u) =>
      String(u.id) !== String(targetUser.id) &&
      u.email.toLowerCase() === targetUser.email.trim().toLowerCase()
  );

  if (emailExists) {
    toast.error("Email already exists");
    return;
  }

  try {
    setSavingUserId(targetUser.id);

    const payload = {
      name: targetUser.name || "",
      email: targetUser.email || "",
      phone: targetUser.phone || "",
      address: targetUser.address || "",
      role: targetUser.role || USER_ROLES.CUSTOMER,
    };

    if ((targetUser.password || "").trim()) {
      payload.password = targetUser.password.trim();
    }

    const updated = await updateUserById(targetUser.id, payload);

    setUsers((prev) =>
      prev.map((u) =>
        String(u.id) === String(targetUser.id)
          ? { ...updated, password: "" }
          : u
      )
    );

    toast.success("User updated");
  } catch (err) {
    toast.error(err.message || "Failed to update user");
  } finally {
    setSavingUserId(null);
  }
};
  const handleDelete = async (targetUser) => {
    if (String(targetUser.id) === String(user?.id)) return;
    const shouldDelete = window.confirm(`Delete user ${targetUser.email || targetUser.name}?`);
    if (!shouldDelete) return;

    try {
      setDeletingUserId(targetUser.id);
      await deleteUserById(targetUser.id);
      setUsers((prev) => prev.filter((u) => String(u.id) !== String(targetUser.id)));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

 return (
  <div>
    <h1 className="text-xl font-bold mb-4 text-black dark:text-white">
      Users
    </h1>

    {/* CREATE USER CARD */}
    <div className="bg-white dark:bg-slate-900 rounded shadow p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      
      <input
        value={newUser.name}
        onChange={(e) => updateNewField("name", e.target.value)}
        placeholder="Full name"
        className="border rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
      />

      <input
        value={newUser.email}
        onChange={(e) => updateNewField("email", e.target.value)}
        placeholder="Email *"
        className="border rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
      />

      <input
        value={newUser.phone}
        onChange={(e) => updateNewField("phone", e.target.value)}
        placeholder="Phone"
        className="border rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
      />

      <input
        value={newUser.address}
        onChange={(e) => updateNewField("address", e.target.value)}
        placeholder="Address"
        className="border rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
      />

      <input
        type="password"
        value={newUser.password}
        onChange={(e) => updateNewField("password", e.target.value)}
        placeholder="Password *"
        className="border rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
      />

      <div className="flex items-center gap-2">
        <select
          value={newUser.role}
          onChange={(e) => updateNewField("role", e.target.value)}
          className="border rounded px-2 py-2 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
        >
          <option value={USER_ROLES.CUSTOMER}>CUSTOMER</option>
          <option value={USER_ROLES.ADMIN}>ADMIN</option>
        </select>

        <button
          onClick={handleCreate}
          disabled={savingUserId === "new"}
          className="text-sm px-3 py-2 rounded bg-green-600 text-white disabled:bg-green-300"
        >
          {savingUserId === "new" ? "Adding..." : "Add user"}
        </button>
      </div>
    </div>

    {/* LOADING */}
    {loading ? (
      <div className="text-gray-500 dark:text-gray-400">
        Loading users from database...
      </div>
    ) : null}

    {/* EMPTY STATE */}
    {!loading && users.length === 0 ? (
      <div className="text-gray-500 dark:text-gray-400">
        No users found.
      </div>
    ) : (
      <div className="grid gap-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white dark:bg-slate-900 rounded shadow p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div className="md:col-span-2 text-xs text-gray-500 dark:text-gray-400">
              ID: {u.id}
            </div>

            <input
              value={u.name || ""}
              onChange={(e) => updateField(u.id, "name", e.target.value)}
              placeholder="Name"
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
            />

            <input
              value={u.email || ""}
              onChange={(e) => updateField(u.id, "email", e.target.value)}
              placeholder="Email"
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
            />

            <input
              value={u.phone || ""}
              onChange={(e) => updateField(u.id, "phone", e.target.value)}
              placeholder="Phone"
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
            />

            <input
              value={u.address || ""}
              onChange={(e) => updateField(u.id, "address", e.target.value)}
              placeholder="Address"
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
            />

            <input
              type="password"
              value={u.password || ""}
              onChange={(e) => updateField(u.id, "password", e.target.value)}
              placeholder="New password (optional)"
              className="border rounded px-3 py-2 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
            />

            <div className="flex items-center gap-2">
              <select
                value={u.role || USER_ROLES.CUSTOMER}
                onChange={(e) => updateField(u.id, "role", e.target.value)}
                className="border rounded px-2 py-1 text-sm bg-white dark:bg-slate-800 text-black dark:text-white border-gray-300 dark:border-slate-700"
              >
                <option value={USER_ROLES.CUSTOMER}>CUSTOMER</option>
                <option value={USER_ROLES.ADMIN}>ADMIN</option>
              </select>

              <button
                onClick={() => handleSave(u)}
                disabled={savingUserId === u.id}
                className="text-sm px-3 py-1 rounded bg-orange-500 text-white disabled:bg-orange-300"
              >
                {savingUserId === u.id ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => handleDelete(u)}
                disabled={
                  String(u.id) === String(user?.id) || deletingUserId === u.id
                }
                className="text-sm px-3 py-1 rounded bg-red-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {deletingUserId === u.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}