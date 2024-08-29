const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((accumulator, object) => (accumulator + object.likes), 0)
  return likes
}

const favoriteBlog = (blogs) => {
  const mostLikes = blogs.reduce((accumulator, current) => {
    return (accumulator.likes > current.likes) ? accumulator : current
  })
  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}