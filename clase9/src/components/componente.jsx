import React, {useState, useEffect, useRef, useReducer} from "react"

function Componente(){
    const [nombre, setNombre] = useState("Alan")
    const referencia = useRef(null);
    
    function cambioEstado(estado, accion){
        console.log(estado)
        if(accion.type === "Login")
            return{estado: "Logeado"}
        else if(accion.type === "deslogueado")
            return{estado: "deslogueado"}
        
        return estado;
    }

    const [sesion, dispatch] = useReducer(cambioEstado, {estado: "No logeado"});

    //ayuda a indicar si algo cambio en este hook uso de useEffect para controlar el cambio de estados de componentes
    // usando [] se activara cuando se inicialize el componente
    useEffect(() => {
        console.log('Algo cambio')
    }, [nombre])

    function cambionombre(nuevoNombre){
        setNombre(nuevoNombre)
        console.log("Cambio de nombre", nuevoNombre)
    }
    
    return (
        <>
            <h1>Estudiante {nombre}</h1>
            <h2>{sesion.estado}</h2>
            <p>{referencia.current?.value || "Sin valor"}</p>
            <button onClick={() => {dispatch({type: "Login"})}}>Login</button>
            <input type="text" ref={referencia}></input>
            
            <button onClick={() => {console.log(referencia.current?.value)}}>Mostrar Valor</button>

            <button onClick={() => cambionombre("Henry")}>Cambio de nombre</button>
            <button onClick={() => cambionombre("Keyly")}>Cambio de nombre</button>
        </>
    )
}

export default Componente