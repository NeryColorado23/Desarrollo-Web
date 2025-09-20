import { useRef } from 'react'
import { getContexto } from '../contexto/contexto'

export default function Login() {
    const { Autenticar } = getContexto()
    const user = useRef()
    const password = useRef()

    const handleLogin = () => {
        const usuario = user.current.value
        const pass = password.current.value
        const ok = Autenticar(usuario, pass)

        if (ok) {
            alert("✅ Sesión iniciada")
        } else {
            alert("❌ Usuario o contraseña incorrectos")
        }
    }

    return (
        <div>
            <input type="text" ref={user} placeholder="Usuario" /> 
            <input type="password" ref={password} placeholder="Contraseña" />
            <button onClick={handleLogin}>Login</button>
        </div>   
    )
}
