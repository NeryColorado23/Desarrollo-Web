import React, {useState, useEffect, useRef} from "react"

function Componente(){
    const [nombre, setNombre] = useState("Alan")
    const referencia = useRef("Hola que hace");

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
            <p>{referencia.current.value}</p>
            <input type="text" ref={referencia}></input>

            <button onClick={()=> {console.log(referencia.current.value)}}>Mostar Valor</button>


          
            <button onClick={() => cambionombre("Henry")}>Cambio de nombre</button>
            <button onClick={() => cambionombre("Keyly")}>Cambio de nombre</button>
        </>
    )
}

export default Componente