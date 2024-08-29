const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)
  if (!body.title || !body.url) {
    response.status(400).end()
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const likes = request.body.likes
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    )
    if (updatedBlog) {
      response.status(201).end()
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const idToDelete = request.params.id
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const userBlogs = user.blogs
    const isFound = userBlogs.some(element => idToDelete === element.toString())
    if (isFound) {
      await Blog.findByIdAndDelete(idToDelete)
      user.blogs = user.blogs.filter(id => id.toString() !== idToDelete)
      await user.save()
        response.status(204).end()
    } else {
      response.status(403).end()
    }
  } catch(exception) {
    response.status(400).end()
  }
})

module.exports = blogsRouter