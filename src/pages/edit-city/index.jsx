import { useLoaderData, useNavigate, Form } from 'react-router-dom'
import { CountryFlag } from '@/ui/country-flag'

const Component = () => {
  const city = useLoaderData()
  const navigate = useNavigate()
  const handleClickBack = () => navigate('/app/cidades')
  return (
    <Form method="post" className="form-edit-city">
      <label>
        <span>Nome da cidade</span>
        <input key={city.id} defaultValue={city.name} name="name" required />
        <CountryFlag country={city.country} className="pa r1 t-3-5" />
      </label>
      <label>
        <span>Quando você foi para {city.name}?</span>
        <input name="date" required type="date" defaultValue={city.date || ''} />
      </label>
      <label>
        <span>Suas anotações sobre a cidade</span>
        <textarea name="notes" required defaultValue={city.notes || ''}></textarea>
      </label>
      <div className="buttons">
        <button onClick={handleClickBack} className="btn-back" type="button">&larr; Voltar</button>
        <button className="btn-save" type="submit">Salvar</button>
      </div>
    </Form>
  )
}

Component.displayName = 'EditCity'

export { Component }
