import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface FormState {
  userName: string;
  phoneNumber: string;
  password: string;
  otp: string;
  userId?: string;
}

const AuthForm: React.FC = () => {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"login" | "signup" | "otp">("login");
  const [form, setForm] = useState<FormState>({
    userName: "",
    phoneNumber: "",
    password: "",
    otp: "",
    userId: "",
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
        const { data }: { data: { token: string; user: { id: string } } } = await axios.post(
          "/api/auth/verify-otp",
          {
            userId: form.userId,
            otp: form.otp,
          }
        );

        localStorage.setItem("token", data.token);
        queryClient.invalidateQueries({ queryKey: ["get-user-w-jwt"] });
        toast.success("حساب شما با موفقیت تأیید شد");
        setForm({ userName: "", phoneNumber: "", password: "", otp: "", userId: "" });
        setMode("login");
        navigate("/");
        return;
      }

      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const { data }: { data: { token: string; user: { id: string } } } = await axios.post(endpoint, {
        userName: form.userName,
        phoneNumber: form.phoneNumber,
        password: form.password,
      });

      if (mode === "signup") {
        setForm((prev) => ({ ...prev, userId: data.user.id, otp: "" }));
        setMode("otp");
        toast.success("کد یک‌بارمصرف برای شما ارسال شد");
      } else {
        localStorage.setItem("token", data.token);
        queryClient.invalidateQueries({ queryKey: ["get-user-w-jwt"] });
        toast.success("با موفقیت وارد شدید");
        navigate("/", { state: { showToast: true } });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "خطایی رخ داد");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12" dir="rtl">
      <Card className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 capitalize">
              {mode === "signup" ? "ثبت‌نام" : mode === "otp" ? "تأیید کد" : "ورود"}
            </h1>
          </div>
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {mode === "otp" ? (
                <div>
                  <Input
                    name="otp"
                    placeholder="کد ۶ رقمی"
                    value={form.otp}
                    onChange={handleChange}
                    required
                    type="text"
                    pattern="[0-9]{6}"
                    inputMode="numeric"
                    className="w-full bg-white text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
                  />
                </div>
              ) : (
                <div className="space-y-5">
                  {mode === "signup" && (
                    <div>
                      <Input
                        name="userName"
                        placeholder="نام کاربری"
                        value={form.userName}
                        onChange={handleChange}
                        required
                        className="w-full bg-white text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
                      />
                    </div>
                  )}
                  <div>
                    <Input
                      name="phoneNumber"
                      placeholder="شماره تلفن"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      required
                      type="tel"
                      className="w-full bg-white text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Input
                      name="password"
                      placeholder="رمز عبور"
                      value={form.password}
                      onChange={handleChange}
                      required
                      type="password"
                      className="w-full bg-white text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition-all duration-200"
                    />
                  </div>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
              >
                {mode === "signup" ? "ثبت‌نام" : mode === "otp" ? "تأیید کد" : "ورود"}
              </Button>
            </motion.form>
          </AnimatePresence>
          {mode !== "otp" && (
            <div className="text-center mt-5">
              <button
                onClick={toggleMode}
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200"
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