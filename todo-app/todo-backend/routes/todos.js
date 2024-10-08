const express = require('express');
const { Todo } = require('../mongo')
const redis = require('../redis')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  let redisValue = await redis.getAsync('added_todos')
  if (redisValue === null || redisValue === "NaN") {
    await redis.setAsync('added_todos', 0)
    redisValue = await redis.getAsync('added_todos')
  }
  const addedValue = parseInt(redisValue) + 1
  await redis.setAsync('added_todos', addedValue)
  console.log(await redis.getAsync('added_todos'))
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todo = await req.todo
  res.send(todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  try {
    const todo = req.todo
    Object.assign(todo, req.body)
    await todo.save()
    res.send(todo)
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
