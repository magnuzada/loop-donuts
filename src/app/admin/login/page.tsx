"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin/orders"); // Manda para o painel
        router.refresh(); // Atualiza para o Middleware pegar o novo cookie
      } else {
        setError("Usuário ou senha incorretos 🔒");
      }
    } catch (err) {
      setError("Erro ao tentar logar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-orange-100 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full">
            <Lock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-black text-center text-gray-800 mb-6">Área Restrita</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Usuário</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-colors"
              placeholder="admin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-colors"
              placeholder="••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 text-center font-medium">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Verificando..." : "Entrar"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}