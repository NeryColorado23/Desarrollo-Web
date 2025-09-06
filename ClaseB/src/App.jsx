
import './component/Encabezado/Encabezado'
import Encabezado, { Cuerpo } from './component/Encabezado/Encabezado'

function App() {
  const Estudiantes = [
    {nombre: "Nery", apellido:"Colorado"},
    {nombre: "Nery", apellido:"Colorado"}
  ]

  return (
  <div>
    <Encabezado/>
    {Estudiantes.map(function(valor){
      return <h5>{valor.nombre} {valor.apellido}</h5>
    })}
      

    <Cuerpo nombre = "Nery" apellido = "Colorado"></Cuerpo>
    <Cuerpo nombre = "Juan" apellido="Garcia"></Cuerpo>
  </div>   
  )
}

export default App
