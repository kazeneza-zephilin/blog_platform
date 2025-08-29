import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";

function App() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/posts/:postId" element={<PostDetail />} />
            </Routes>
        </div>
    );
}

export default App;
