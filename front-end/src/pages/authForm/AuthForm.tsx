import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FormState {
  userName: string;
  phoneNumber: string;
  password: string;
}

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState<FormState>({
    userName: "",
    phoneNumber: "",
    password: "",
  });
  const navigate = useNavigate();

  const toggleMode = () => setMode((prev) => (prev === "login" ? "signup" : "login"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const endpoint = `http://localhost:3000${mode === "signup" ? "/auth/signup" : "/auth/login"}`
      const { data }: { data: { token: string } } = await axios.post(endpoint, form);
      alert(`${mode === "signup" ? "Signup" : "Login"} successful!`);
      localStorage.setItem("token", data.token);
      navigate("/")
      // You can store token in localStorage or context here
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold capitalize">
            {mode}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === "signup" && (
                <Input
                  name="userName"
                  placeholder="Username"
                  value={form.userName}
                  onChange={handleChange}
                  required
                />
              )}
              <Input
                name="phoneNumber"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                type="tel"
              />
              <Input
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                type="password"
              />
              <Button type="submit" className="w-full">
                {mode === "signup" ? "Sign Up" : "Log In"}
              </Button>
            </motion.form>
          </AnimatePresence>
          <div className="text-center mt-4">
            <button
              onClick={toggleMode}
              className="text-sm text-blue-500 hover:underline"
            >
              {mode === "signup"
                ? "Already have an account? Log in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;