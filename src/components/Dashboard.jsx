import Layout from "./Layout"

const Dashboard = () => {
    // const { user } = useAuth()

    return (
        <Layout>
            <div className="bg-[#fff8e7] rounded-lg shadow-md p-8 text-center">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-[#d2b48c] rounded-full flex items-center justify-center shadow mb-4">
                        <img
                            src="https://i.pinimg.com/736x/2a/58/a9/2a58a9c65d07c17aa32b7c0a7bff1861.jpg"
                            alt="Café"
                            className="w-20 h-20 rounded-full object-cover"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-[#6f4e37] mb-2">Cafeteria Golden</h1>
                </div>
                <h2 className="text-xl font-semibold text-[#6f4e37] mb-4">
                    Selecciona una opción del menú para comenzar
                </h2>
                <p className="text-[#8b6f47]">
                    Usa el menú de arriba para navegar entre los módulos de Tipos y Productos
                </p>
            </div>
        </Layout>
    )
}

export default Dashboard