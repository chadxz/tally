import { Hono } from 'hono'
import { hello } from './hello.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text(hello)
})

export default app;
