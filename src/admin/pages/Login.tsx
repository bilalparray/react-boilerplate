import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../api/base/apiClient";
import { setToken } from "../../auth/tokenManager";

interface LoginResponseDTO {
  token: string;
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await apiPost<LoginResponseDTO>("/auth/login", {
      email,
      password,
    });

    setLoading(false);

    if (res.isError || !res.successData) {
      setError(res.errorData?.displayMessage || "Login failed");
      return;
    }

    setToken(res.successData.token);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-4 shadow"
        style={{ width: "360px" }}>
        <h2 className="fw-bold mb-4 text-center">Sign in</h2>

        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control rounded-pill"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control rounded-pill"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn w-100 rounded-pill text-white fw-semibold"
          style={{ background: "#16a34a" }}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
