const CountryFlag = ({ country, className, width = 20, height = 15 }) => {
  const src = `https://flagcdn.com/${width}x${height}/${country.code}.png`
  return <img className={className} src={src} alt={country.name} />
}

export { CountryFlag }
