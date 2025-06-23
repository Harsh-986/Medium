import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string
	}
}>();

///////Middleware////////////

app.use('/api/v1/blog/*', async(c ,next) => {
  const header =  c.req.header("authorization") || ""



  const res = await verify(header, c.env.JWT_SECRET)
  if (res.id) {
    next()
  }else {
    c.status(403)
    return c.json({error:"unauth"})
  }
})

///////////////////////////////////////

app.get('/api/v1/signup', async(c) => {
  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  const body = await c.req.json()

  const User = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password
    }
  })
  const token = await sign({ id: User.id}, c.env.JWT_SECRET)
  return c.json({
    jwt: token
  })
})

/////////////////////////////////////////

app.post('/api/v1/signin', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL
  }).$extends(withAccelerate())
  
  const body = await c.req.json()
  const User = await prisma.user.findUnique({
    where: {
      email : body.email
    }
  })

  const jwt  = await sign({ id : User.id},c.env.JWT_SECRET)
  return c.json({ jwt })
})



app.post('/api/v1/blog', (c) => {

  return c.text('Hello Hono!')
})

app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('Hello Hono!')
})

export default app
