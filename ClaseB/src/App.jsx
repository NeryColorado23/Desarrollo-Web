
import './component/Encabezado/Encabezado'
import Encabezado, { Cuerpo } from './component/Encabezado/Encabezado'
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  const Estudiantes = [
    {nombre: "Nery", apellido:"Colorado"},
    {nombre: "Nery", apellido:"Colorado"}
  ]

  return (
  <div>
    <Encabezado/>
    {Estudiantes.map(function(valor){
      return <Cuerpo {...valor}/>
    })}
      

    <Cuerpo nombre = "Nery" apellido = "Colorado">
      <p>Contendido</p>
    </Cuerpo>
    <Cuerpo nombre = "Juan" apellido="Garcia"></Cuerpo>
  </div>   
  )
}

export default App
