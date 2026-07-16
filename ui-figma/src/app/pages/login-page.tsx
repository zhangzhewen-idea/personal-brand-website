import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Video, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - 实际使用时需要连接后端
    console.log("Login:", loginForm);
    // 模拟登录成功后跳转
    navigate("/");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock register - 实际使用时需要连接后端
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("两次密码不一致");
      return;
    }
    console.log("Register:", registerForm);
    // 模拟注册成功后跳转
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 flex-col justify-between text-white">
        <Link to="/" className="flex items-center gap-2">
          <Video className="w-8 h-8" />
          <span className="text-2xl font-bold">影像创作者</span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            用剪辑重构<br />影像记忆
          </h1>
          <p className="text-xl text-blue-100">
            加入我们，开启你的创作之旅
          </p>

          <div className="grid grid-cols-3 gap-6 pt-8">
            <div>
              <div className="text-3xl font-bold">1000万+</div>
              <div className="text-sm text-blue-200">全网播放</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50万+</div>
              <div className="text-sm text-blue-200">点赞收藏</div>
            </div>
            <div>
              <div className="text-3xl font-bold">20万+</div>
              <div className="text-sm text-blue-200">忠实粉丝</div>
            </div>
          </div>
        </div>

        <div className="text-sm text-blue-200">
          © 2026 影像创作者. All rights reserved.
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Video className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">影像创作者</span>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="register">注册</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">欢迎回来</h2>
                  <p className="text-gray-600">登录你的账号继续创作</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">邮箱</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="login-password">密码</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-600">记住我</span>
                    </label>
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      忘记密码?
                    </a>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    登录
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                  还没有账号?{" "}
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    立即注册
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">创建账号</h2>
                  <p className="text-gray-600">加入我们，开启创作之旅</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-username">用户名</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="你的用户名"
                        className="pl-10"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-email">邮箱</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-password">密码</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="至少8位字符"
                        className="pl-10 pr-10"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-confirm-password">确认密码</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="再次输入密码"
                        className="pl-10"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="text-sm">
                    <label className="flex items-start gap-2">
                      <input type="checkbox" className="rounded mt-1" required />
                      <span className="text-gray-600">
                        我同意{" "}
                        <a href="#" className="text-blue-600 hover:text-blue-700">
                          服务条款
                        </a>{" "}
                        和{" "}
                        <a href="#" className="text-blue-600 hover:text-blue-700">
                          隐私政策
                        </a>
                      </span>
                    </label>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    注册
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                  已有账号?{" "}
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    立即登录
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
