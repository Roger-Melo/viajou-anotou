const removeZero = string => string[0] === '0' ? string[1] : string

const getFormattedDate = dateString => {
  const [year, month, day] = dateString.split('-')
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  return `${removeZero(day)} de ${months[+removeZero(month) - 1]} de ${year}`
}

export { getFormattedDate }
