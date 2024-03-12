import { useParams, useNavigate, useOutletContext, Form } from 'react-router-dom'
import { CountryFlag } from '@/ui/country-flag'
import { getFormattedDate } from '@/resources/utils/get-formatted-date'

const TripDetails = () => {
  const params = useParams()
  const navigate = useNavigate()
  const cities = useOutletContext()
  const city = cities.find(city => params.id === String(city.id))
  const handleClickBack = () => navigate('/app/cidades')

  const deleteTrip = e => {
    const wantToDelete = confirm('Por favor, confirme que você quer deletar essa viagem.')
    if (!wantToDelete) {
      e.preventDefault()
    }
  }

  return (
    <div className="city-details">
      <div className="row">
        <h5>Nome da cidade</h5>
        <h3>
          <CountryFlag country={city.country} />
          {city.name}
        </h3>
      </div>
      <div className="row">
        <h5>Quando você foi para {city.name}?</h5>
        <p>{getFormattedDate(city.date)}</p>
      </div>
      <div className="row">
        <h5>Suas anotações</h5>
        <p>{city.notes}</p>
      </div>
      <div className="buttons">
        <button className="btn-back" onClick={handleClickBack}>&larr; Voltar</button>
        <Form action="edit">
          <button className="btn-edit" type="submit">&there4; Editar</button>
        </Form>
        <Form method="post" action="delete" onSubmit={deleteTrip}>
          <button className="btn-delete" type="submit">&times; Deletar</button>
        </Form>
      </div>
    </div>
  )
}

export { TripDetails }
