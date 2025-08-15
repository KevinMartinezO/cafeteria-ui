import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth(); // Removemos loading del contexto
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Evitar múltiples envíos
        if (isSubmitting) {
            return;
        }

        setError("");
        setIsSubmitting(true);

        // Validaciones básicas (solo formato, no complejidad)
        if (!email.trim()) {
            setError('El email es requerido');
            setIsSubmitting(false);
            return;
        }

        // Validación básica de formato de email (no tan estricta)
        if (!email.includes('@') || !email.includes('.')) {
            setError('Por favor ingresa un email válido');
            setIsSubmitting(false);
            return;
        }

        if (!password.trim()) {
            setError('La contraseña es requerida');
            setIsSubmitting(false);
            return;
        }
        
        // Sin validaciones complejas de contraseña para login
        // El servidor validará las credenciales

        try {
            console.log("Intentando login con:", { email, password: "***" });
            const result = await login(email, password);
            console.log("Resultado del login:", result);
            if (result) {
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            console.error("Error en login:", error);
            setError(error.message || 'Error al iniciar sesión. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <div className="min-h-screen bg-[#6f4e37] flex items-center justify-center p-4">
            <div className="bg-[#fff8e7] p-8 rounded-lg shadow-md w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-[#d2b48c] rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                        <img
                            src="https://i.pinimg.com/736x/2a/58/a9/2a58a9c65d07c17aa32b7c0a7bff1861.jpg"
                            alt="Café"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-[#6f4e37]">Cafeteria Golden</h1>
                    <p className="text-[#8b6f47]">Inicia sesión</p>
                </div>

                {/* Mensaje de error */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        <div className="flex items-center">
                            <span className="mr-2">❌</span>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Formulario */}
                <form
                    className="space-y-4"
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#6f4e37] mb-1">
                    Email
                    </label>
                    <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-3 py-2 border border-[#d2b48c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6f4e37] bg-[#fff8e7] text-[#6f4e37]"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={ (e) => {
                        setEmail(e.target.value);
                        if (error) setError(''); // Limpiar error cuando el usuario escriba
                    }}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#6f4e37] mb-1">
                    Contraseña
                    </label>
                    <input
                    type="password"
                    id="password"
                    required
                    className="w-full px-3 py-2 border border-[#d2b48c] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6f4e37] bg-[#fff8e7] text-[#6f4e37]"
                    placeholder="••••••••"
                    value={password}
                    onChange={ (e) => {
                        setPassword(e.target.value);
                        if (error) setError(''); // Limpiar error cuando el usuario escriba
                    }}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#6f4e37] text-white py-2 px-4 rounded-md hover:bg-[#8b6f47] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
                </form>

                {/* Link de registro */}
                <p className="text-center text-sm text-[#6f4e37] mt-4">
                ¿No tienes cuenta?{" "}
                <Link to="/signup" className="text-[#6f4e37] hover:text-[#8b6f47]">
                    Regístrate
                </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginScreen