import React, { createContext, useContext, useState } from "react"

const ConAuth = createContext()

// creamos componente
export default function Contexto({ children }) {
    const [sesion, setSesion] = useState("Willy")

    function Autenticar(user, pass) {
        if (user === "admin" && pass === "tortilla") {
            setSesion(user)
            return true
        } else {
            return false
        }
    }

    return (
        <ConAuth.Provider value={{ sesion, setSesion, Autenticar }}>
            {children}
        </ConAuth.Provider>
    )
}

export function getContexto() {
    return useContext(ConAuth)
}
