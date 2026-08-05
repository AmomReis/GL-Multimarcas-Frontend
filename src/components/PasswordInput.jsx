import { useState } from 'react'
import { IconEye, IconEyeOff } from './icons'

// Campo de senha com ícone de olho pra alternar entre texto oculto/visível.
export default function PasswordInput({ id, value, onChange, autoComplete, required, minLength }) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div className="campo-senha">
      <input
        id={id}
        type={visivel ? 'text' : 'password'}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className="campo-senha__olho"
        onClick={() => setVisivel((v) => !v)}
        aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visivel}
        tabIndex={-1}
      >
        {visivel ? <IconEyeOff /> : <IconEye />}
      </button>
    </div>
  )
}
