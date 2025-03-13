import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">AI Banking App</h1>
        <LoginForm />
      </div>
    </div>
  );
}
