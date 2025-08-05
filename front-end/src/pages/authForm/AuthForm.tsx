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
  otp: string;
}

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<"login" | "signup" | "otp">("login");
  const [form, setForm] = useState<FormState>({
    userName: "",
    phoneNumber: "",
    password: "",
    otp: "",
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
      if (mode === "otp") {
        alert("OTP submitted!");
        setForm({ userName: "", phoneNumber: "", password: "", otp: "" });
        setMode("login");
        navigate("/");
        return;
      }
      const endpoint = `http://localhost:3000${mode === "signup" ? "/auth/signup" : "/auth/login"}`;
      const { data }: { data: { token: string } } = await axios.post(endpoint, form);
      alert(`${mode === "signup" ? "ثبت‌نام" : "ورود"} موفق!`);
      localStorage.setItem("token", data.token);
      if (mode === "signup") {
        setMode("otp"); // Show OTP input after signup
      } else {
        navigate("/");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error?.response?.data?.message || "خطایی رخ داد");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white md:bg-gray-100 md:px-4" dir="rtl">
      <Card className="w-full max-w-md md:shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold capitalize">
            {mode === "signup" ? "ثبت‌نام" : mode === "otp" ? "تأیید کد یک‌بارمصرف" : "ورود"}
          </CardTitle>
        </CardHeader>
        <CardContent >
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
              {mode === "otp" ? (
                <Input
                  name="otp"
                  placeholder="کد یک‌بارمصرف"
                  value={form.otp}
                  onChange={handleChange}
                  required
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className=""
                />
              ) : (
                <>
                  {mode === "signup" && (
                    <Input
                      name="userName"
                      placeholder="نام کاربری"
                      value={form.userName}
                      onChange={handleChange}
                      required
                    />
                  )}
                  <Input
                    name="phoneNumber"
                    placeholder="شماره تلفن"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                    type="tel"
                    className="text-end"
                  />
                  <Input
                    name="password"
                    placeholder="رمز عبور"
                    value={form.password}
                    onChange={handleChange}
                    required
                    type="password"
                  />
                </>
              )}
              <Button type="submit" className="w-full">
                {mode === "signup" ? "ثبت‌نام" : mode === "otp" ? "تأیید کد" : "ورود"}
              </Button>
            </motion.form>
          </AnimatePresence>
          {mode !== "otp" && (
            <div className="text-center mt-4">
              <button
                onClick={toggleMode}
                className="text-sm text-blue-500 hover:underline"
              >
                {mode === "signup"
                  ? "حساب کاربری دارید؟ وارد شوید"
                  : "حساب کاربری ندارید؟ ثبت‌نام کنید"}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;