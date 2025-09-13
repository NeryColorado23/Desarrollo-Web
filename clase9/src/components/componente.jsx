import React, {useState} from "react"

function Componente(){
    const [nombre, setNombre] = useState("Alan")

    function cambionombre(nuevoNombre){
        setNombre(nuevoNombre)
        console.log("Cambio de nombre", nuevoNombre)
    }
    
    return (
        <>
            <h1>Estudiante {nombre}</h1>
            <p>contenido</p>
            <button onClick={() => cambionombre("Henry")}>Cambio de nombre</button>
            <button onClick={() => cambionombre("Keyly")}>Cambio de nombre</button>
        </>
    )
}

export default Componente