import { Link } from 'react-router-dom'

const Logo = ({ version = 'dark' }) =>
  <Link to="/">
    <img className="logo" src={`/logo-viajou-anotou-${version}.png`} alt="Logo ViajouAnotou" />
  </Link>

export { Logo }
