import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({children}) => {
    const { isAuthenticated, loading  } = useAuth()

    if(loading){
        return(
            <div className="min-h-screen flex items-center justify-center bg-[#6f4e37]">
                <div className="text-center">
                <div className="w-16 h-16 bg-[#d2b48c] rounded-full flex items-center justify-center mx-auto mb-4 shadow">
                    <span className="text-[#6f4e37] font-semibold">⏳</span>
                </div>
                <p>Cargando...</p>
                </div>
            </div>
        )
    }

    // Si está autenticado, redirigir al dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

export default PublicRoute