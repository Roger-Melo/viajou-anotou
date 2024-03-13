import { useOutletContext } from 'react-router-dom'
import { CountryFlag } from '@/ui/country-flag'

const Component = () => {
  const cities = useOutletContext()
  const countries = cities.reduce((acc, city) => {
    const duplicatedCountry = acc.some(accItem => accItem.name === city.country.name)
    return duplicatedCountry ? acc : [...acc, city.country]
  }, [])

  return (
    <ul className="countries">
      {countries.map(country =>
        <li key={country.name}>
          <CountryFlag country={country} width={24} height={18} className="mr-05 mb--3px" />
          {country.name}
        </li>
      )}
    </ul>
  )
}

Component.displayName = 'Countries'

export { Component }
