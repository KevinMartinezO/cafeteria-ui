import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"

const Layout = ({ children }) => {
    const navigate = useNavigate()
    const { user, logout, validateToken } = useAuth()

    useEffect(() => {
        const interval = setInterval(() => {
            if (!validateToken()) {
                clearInterval(interval);
            }
        }, 60000);

        validateToken();

        return () => clearInterval(interval);
    }, [validateToken]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <div className="min-h-screen bg-[#6f4e37]">
            <div className="bg-[#fff8e7] shadow-lg">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center py-4 border-b border-[#d2b48c]">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-[#d2b48c] rounded-full flex items-center justify-center shadow">
                                <img
                                    src="https://i.pinimg.com/736x/2a/58/a9/2a58a9c65d07c17aa32b7c0a7bff1861.jpg"
                                    alt="Café"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-[#6f4e37]">Cafeteria Golden</h1>
                                <p className="text-[#8b6f47]">Hola {`${user.firstname} ${user.lastname}`}</p>
                            </div>
                        </div>
                        <button 
                            className="bg-[#6f4e37] text-white px-4 py-2 rounded-md hover:bg-[#8b6f47] transition-colors"
                            onClick={handleLogout}
                        >
                            Cerrar Sesión
                        </button>
                    </div>

                    <nav className="py-4">
                        <ul className="flex space-x-8">
                            <li>
                                <button 
                                    className="flex items-center px-4 py-2 text-[#6f4e37] hover:text-[#8b6f47] hover:bg-[#fff8e7] rounded-md transition-colors font-medium"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    <span className="mr-2">🏠</span>
                                    Inicio
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="flex items-center px-4 py-2 text-[#6f4e37] hover:text-[#8b6f47] hover:bg-[#fff8e7] rounded-md transition-colors font-medium"
                                    onClick={() => navigate('/catalog-types')}
                                >
                                    <span className="mr-2">🏷️</span>
                                    Tipos
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="flex items-center px-4 py-2 text-[#6f4e37] hover:text-[#8b6f47] hover:bg-[#fff8e7] rounded-md transition-colors font-medium"
                                    onClick={() => navigate('/catalogs')}
                                >
                                    <span className="mr-2">📋</span>
                                    Catálogos
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    )
}

export default Layout