const fetchCityInfo = async request => {
  const url = new URL(request.url)
  const [latitude, longitude] = ['latitude', 'longitude'].map(item => url.searchParams.get(item))
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt-BR`)
  const { city, countryName, countryCode } = await response.json()
  return {
    id: request.url.split('/')[5],
    name: city,
    country: { name: countryName, code: countryCode.toLowerCase() },
    position: { latitude, longitude }
  }
}

export { fetchCityInfo }
