export default function Encabezado(){
    return <h1>Hola Que hace - Encabezado</h1>
}

export function Cuerpo(props){
    const {nombre, apellido, children} = props
//    const nombre = props.nombre
  //  const apellido = props.apellido
    return <div>Estudiante  {nombre} {apellido} Contenido {children}</div>
}