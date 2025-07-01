import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { createBlogInput, updateBlogInput } from "@hy025u/medium";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId : string;
    }
}>();

////////////////////////////

blogRouter.use("/*", async(c,next) => {
    let header =  c.req.header("authorization") || ""
    // if (header.startsWith("Bearer ")) {
    //     header = header.slice(7); // remove "Bearer "
    // }
    try {
        const res = await verify(header, c.env.JWT_SECRET);
        if (res.id) {
            c.set("userId", String(res.id));
            await next();
        } else {
            c.status(403);
            return c.json({ error: "Unauthorized" });
        }
    } catch (err) {
        c.status(401);
        return c.json({ error: "Invalid token" });
    }

})

//////////////////////////////////

blogRouter.post('/', async(c) => {
    const body = await c.req.json()
    const {success} = createBlogInput.safeParse(body) 
      if (!success) {
        c.status(411)
        return c.json({
          msg:"input incorrect"
        })
      }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const Blog = await prisma.post.create({
        data:{
            title : body.title,
            content : body.content,
            authorId : c.get("userId")
        }
    })
    return c.json({
        id: Blog.id
    })
})

///////////////////////////////////

blogRouter.put('/', async(c) => {
   const body = await c.req.json()
    const {success} = updateBlogInput.safeParse(body) 
     if (!success) {
       c.status(411)
       return c.json({
         msg:"input incorrect"
       })
     }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.post.update({
        where:{
            id : body.id
        },data :{
            title :body.title,
            content: body.content,
            authorId : c.get("userId")
        }
    })
    return c.json({
        id: blog.id
    })
})

/////////////////////////////////////

blogRouter.get('/bulk', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const blogs = await prisma.post.findMany({
        select:{
            content :true ,
            title :true ,
            id : true,
            author : {
                select : {
                    name : true 
                }
             }
        }
    })

    return c.json({
        blogs
    })
})

////////////////////////////////////

blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.post.findFirst({
            where: { id },
            select: {
                content :true ,
                title :true ,
                id : true,
                author : {
                    select : {
                        name : true 
                    }
                }
            }
        });
        return c.json({ blog });
    } catch (e) {
        c.status(500);
        return c.json({ msg: "Error fetching blog" });
    }
});


/////////////////////////////////////////////

