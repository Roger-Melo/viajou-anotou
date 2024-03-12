import localforage from 'localforage'

const fetchCityInDb = id =>
  localforage.getItem('cities').then(cities => cities?.find(city => city.id === id))

export { fetchCityInDb }
