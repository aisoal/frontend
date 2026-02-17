import { createContext } from "react";
import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (email, password) => {
    const response = await api.post("/auth/register", { email, password });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateUserCount = (newCount) => {
    if (user) {
      setUser({ ...user, generation_count: newCount });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, updateUserCount }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
