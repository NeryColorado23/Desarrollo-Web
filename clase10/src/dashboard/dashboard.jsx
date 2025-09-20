import { getContexto } from "../contexto/contexto"

export default function(){
    const {sesion} = getContexto()
    return (
        <div>
            <h1>Dashboard {sesion}</h1>
        </div>
    )
}

