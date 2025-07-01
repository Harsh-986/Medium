import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign} from 'hono/jwt'
import { Hono } from "hono";
import { signinInput, signupInput } from '@hy025u/medium';


export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string,
        JWT_SECRET: string
	}
}>();


userRouter.post('/signup', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const body = await c.req.json();
    console.log("BODY RECEIVED:", body);

    const { success } = signupInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({ msg: "input incorrect" });
    }
    // before create:
    const exists = await prisma.user.findUnique({ where: { email: body.username } });
    if (exists) {
      c.status(409);
      return c.json({ msg: "User already exists" });
    }


    const user = await prisma.user.create({
      data: {
        email: body.username,
        password: body.password,
        name: body.name || "" // <-- add fallback if name is optional
      }
    });

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.text(jwt)

  } catch (err) {
    console.error("🔥 SIGNUP SERVER ERROR:", err);
    c.status(500);
    return c.json({ msg: "Internal Server Error" });
  }
});


/////////////////////////////////////////

userRouter.post('/signin', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL
  }).$extends(withAccelerate())
  
  const body = await c.req.json()
  const {success} = signinInput.safeParse(body) 
  if (!success) {
    c.status(411)
    return c.json({
      msg:"input incorrect"
    })
  }
  const User = await prisma.user.findUnique({
    where: {
      email : body.username
    }
  })

  if (!User) {
    c.status(403)
    return c.json({ msg: "Invalid email or password" })
  }

  const jwt  = await sign({ id : User.id},c.env.JWT_SECRET)
  return c.text(jwt)
})


