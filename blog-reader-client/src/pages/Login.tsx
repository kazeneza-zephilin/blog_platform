import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

interface FormData {
    email: string;
    password: string;
}

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState<FormData>({ email: "", password: "" });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setServerError(null);
    };

    const validate = (): boolean => {
        const newErrors: Partial<FormData> = {};
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email))
            newErrors.email = "Email is invalid";

        if (!form.password) newErrors.password = "Password is required";
        else if (form.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);
        if (!validate()) return;

        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate("/"); // redirect to home page
        } catch (err: any) {
            if (err.response)
                setServerError(
                    err.response.data.message || "Invalid credentials"
                );
            else if (err.request)
                setServerError("Server not reachable. Please try again later.");
            else setServerError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen bg-orange-50">
                <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-4 text-orange-600">
                        Login
                    </h2>

                    {serverError && (
                        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 ${
                                errors.email
                                    ? "border-orange-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-orange-600 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 ${
                                errors.password
                                    ? "border-orange-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.password && (
                            <p className="text-orange-600 text-sm mt-1">
                                {errors.password}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-center text-gray-700">
                        Don’t have an account?{" "}
                        <Link
                            to="/register"
                            className="text-orange-600 hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
