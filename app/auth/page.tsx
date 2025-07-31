// THIS IS THE FIX: Add "use client" at the very top of the file.
"use client";

import type { Dispatch, SetStateAction, FormEvent } from "react";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Heart,
  User,
  Mail,
  Phone,
  Lock,
  Stethoscope,
  Eye,
  EyeOff,
} from "lucide-react";

type AuthFormProps = {
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
  isDoctor: boolean;
  setIsDoctor: Dispatch<SetStateAction<boolean>>;
  formData: { name: string; email: string; phone: string; password: string };
  handleInputChange: (field: string, value: string) => void;
  handleSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
};

// Reusable AuthForm Component
const AuthForm = ({
  isLogin,
  setIsLogin,
  isDoctor,
  setIsDoctor,
  formData,
  handleInputChange,
  handleSubmit,
  isLoading,
  showPassword,
  setShowPassword,
}: AuthFormProps) => (
  <div className="relative z-10 w-full max-w-md">
    {/* Header */}
    <div className="text-center mb-8 animate-fadeInUp">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl">
          <Heart className="w-8 h-8 text-primary-foreground" />
        </div>
        <span className="text-4xl font-bold text-primary">Schedula</span>
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        {isLogin ? "Welcome Back!" : "Join Schedula"}
      </h1>
      <p className="text-muted-foreground">
        {isLogin
          ? "Sign in to continue your health journey"
          : "Start your healthcare journey today"}
      </p>
    </div>

    {/* Main Card */}
    <Card className="shadow-2xl animate-fadeInUp animation-delay-200 bg-card">
      <CardContent className="p-6 sm:p-8">
        {/* Role Toggle */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-6 mb-8 p-3 bg-muted rounded-2xl">
          <div
            className={`flex items-center space-x-2 transition-all duration-300 ${
              !isDoctor ? "text-primary scale-110" : "text-muted-foreground"
            }`}
          >
            <User className="w-5 h-5" />
            <Label
              htmlFor="role-switch"
              className="font-semibold cursor-pointer"
            >
              Patient
            </Label>
          </div>
          <Switch
            id="role-switch"
            checked={isDoctor}
            onCheckedChange={setIsDoctor}
          />
          <div
            className={`flex items-center space-x-2 transition-all duration-300 ${
              isDoctor ? "text-primary scale-110" : "text-muted-foreground"
            }`}
          >
            <Stethoscope className="w-5 h-5" />
            <Label
              htmlFor="role-switch"
              className="font-semibold cursor-pointer"
            >
              Doctor
            </Label>
          </div>
        </div>

        {/* Auth Toggle Buttons */}
        <div className="flex bg-muted rounded-2xl p-1 mb-8">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              isLogin
                ? "bg-card text-card-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              !isLogin
                ? "bg-card text-card-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted/50"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="animate-slideInLeft">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative mt-2">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-12 h-14 rounded-xl"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          )}

          <div className="animate-slideInLeft animation-delay-100">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-12 h-14 rounded-xl"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="animate-slideInLeft animation-delay-200">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-2">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-12 h-14 rounded-xl"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
          )}

          <div className="animate-slideInLeft animation-delay-300">
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-12 pr-12 h-14 rounded-xl"
                placeholder="Enter your password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl animate-slideInUp animation-delay-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                <span>Please wait...</span>
              </div>
            ) : (
              `${isLogin ? "Sign In" : "Create Account"}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
);

// This is the main component for the page
export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [isDoctor, setIsDoctor] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" })
  
    const { login } = useAuth()
    const router = useRouter()
    const { toast } = useToast()
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      try {
        if (isLogin) {
          const user = await authAPI.login(formData.email, formData.password, isDoctor ? "doctor" : "patient")
          login(user)
          router.push(isDoctor ? "/doctor/dashboard" : "/")
          toast({ title: "Welcome back!", description: "You have been logged in successfully." })
        } else {
          const signupData = { ...formData, role: isDoctor ? "doctor" : "patient" };
          const user = await authAPI.signup(signupData, isDoctor ? "doctor" : "patient")
          login(user)
          router.push(isDoctor ? "/doctor/dashboard" : "/")
          toast({ title: "Account created!", description: "Your account has been created successfully." })
        }
      } catch (error) {
        toast({
          title: "Authentication Error",
          description: error instanceof Error ? error.message : "Authentication failed.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  
    const handleInputChange = (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  
    const formProps = {
      isLogin, setIsLogin, isDoctor, setIsDoctor, formData, handleInputChange,
      handleSubmit, isLoading, showPassword, setShowPassword
    };
  
    return (
      <>
        <ThemeToggle />
        {/* Desktop Layout */}
        <div className="hidden lg:flex min-h-screen bg-background">
          <div className="flex-1 flex items-start justify-center pt-32 p-12 relative overflow-hidden">
            <div className="relative z-10 text-center animate-fadeInUp">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl">
                  <Heart className="w-10 h-10 text-primary-foreground" />
                </div>
                <span className="text-5xl font-bold text-primary">
                  Schedula
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">Welcome to Schedula</h2>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Your trusted healthcare companion. Connect with qualified doctors and manage your health journey with ease.
              </p>
            </div>
          </div>
  
          <div className="flex-1 bg-background flex items-center justify-center p-12 relative overflow-hidden">
            <AuthForm {...formProps} />
          </div>
        </div>
  
        {/* Mobile Layout */}
        <div className="lg:hidden min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
          <AuthForm {...formProps} />
        </div>
      </>
    )
  }