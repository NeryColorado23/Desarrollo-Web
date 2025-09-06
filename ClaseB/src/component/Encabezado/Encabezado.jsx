import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


export default function Encabezado(){
//    return <h1>Hola Que hace - Encabezado</h1>
return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export function Cuerpo(props){
    const {nombre, apellido, children} = props
//    const nombre = props.nombre
  //  const apellido = props.apellido
    return <div>Estudiante  {nombre} {apellido} Contenido {children}</div>
}