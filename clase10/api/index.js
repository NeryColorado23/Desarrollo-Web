import express, { request, response } from 'express'
import cors from 'cors'
import morgan from 'morgan'

const empleados = [];

const api = express();
api.use(cors());
api.use(morgan());
api.use(express.json());

function existeUsuario(id){
    for(let i = 0; i<empleados.length; i++){
        if(empleados[i].id == id)
            return true;
    }
    return false;
}

//creacion de servicio del listado de empleados
//recibe dos parametros
api.get("/", function(request, response){
    return response.json({"message" : "empleados", empleados})
});


//servicio post para agregar empleados
api.post("/", (request, response)=>{
    const {id, nombre, rol, correo, telefono} = request.body

    //validar si vienen datos
    if(!id || !nombre || !rol || !correo || !telefono ){
        return response.status(400).json({"message": "Campos vacios"})
    }

    //validacion de que no se repitan datos de id
    if(existeUsuario(id)){
        return response.status(409).json({"message": "Usuario Ya existe"})
    }

    empleados.push({id, nombre, rol, correo, telefono})
    return response.status(201).json({"message" : "Empleado Creado"})
});

api.listen(3000);
