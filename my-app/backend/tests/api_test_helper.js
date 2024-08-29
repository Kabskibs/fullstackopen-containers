const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
  title: "api_test_5",
  author: "1 ASD",
  url: "apitest.test",
  likes: "1"
  },
  {
    title: "api_test_6",
    author: "2 ASD",
    url: "apitest.test",
    likes: "2"
  },
  {
    title: "api_test_7",
    author: "3 ASD",
    url: "apitest.test",
    likes: "3"
  }
]

const initialUsers = [
  {
    username: "test_user1",
    name: "Test User1",
    password: "test_password"
  },
  {
    username: "test_user2",
    name: "Test User2",
    password: "test_password"
  }
]

module.exports = {
  initialBlogs,
  initialUsers
}