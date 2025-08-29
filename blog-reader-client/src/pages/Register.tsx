import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState<FormData>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setServerError(null);
    };

    const validate = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!form.username.trim()) newErrors.username = "Username is required";
        else if (form.username.length < 3)
            newErrors.username = "Username must be at least 3 characters";

        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email))
            newErrors.email = "Email is invalid";

        if (!form.password) newErrors.password = "Password is required";
        else if (form.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";

        if (!form.confirmPassword)
            newErrors.confirmPassword = "Please confirm your password";
        else if (form.confirmPassword !== form.password)
            newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);
        if (!validate()) return;

        setLoading(true);
        try {
            await register(form.username, form.email, form.password);
            navigate("/login"); // redirect to login after successful registration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err.response)
                setServerError(
                    err.response.data.message || "Registration failed"
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
                        Register
                    </h2>

                    {serverError && (
                        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 ${
                                errors.username
                                    ? "border-orange-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.username && (
                            <p className="text-orange-600 text-sm mt-1">
                                {errors.username}
                            </p>
                        )}

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

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 ${
                                errors.confirmPassword
                                    ? "border-orange-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.confirmPassword && (
                            <p className="text-orange-600 text-sm mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-center text-gray-700">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-orange-600 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
