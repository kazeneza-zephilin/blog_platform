import { useAuth } from "../context/AuthContext";

const UserInfo = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="p-4 bg-orange-100 rounded-lg shadow mb-4">
      <p className="font-bold text-orange-700">Logged in as: {user.username}</p>
      <p className="text-orange-600">Role: {user.role}</p>
      <button
        className="mt-2 px-4 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default UserInfo;
