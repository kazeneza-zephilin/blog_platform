import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-orange-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          MyBlog
        </Link>

        {/* Menu */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-orange-200 transition">
            Home
          </Link>
          <Link to="/posts" className="hover:text-orange-200 transition">
            Posts
          </Link>
          {user ? (
            <>
              <span className="text-sm">
                Hello, <span className="font-semibold">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-orange-500 hover:bg-orange-400 px-3 py-1 rounded transition text-white text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-orange-500 hover:bg-orange-400 px-3 py-1 rounded transition text-white text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-400 px-3 py-1 rounded transition text-white text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
