import express from 'express';
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from './middleware';
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from "@repo/common/types"
import {prismaClient} from "@repo/db/client"

const app= express();
app.use(express.json())



app.post('/signup',async(req,res)=>{
   const parsedData = CreateUserSchema.safeParse(req.body)
   if(!parsedData.success){
    res.json({
        message : "Incorrect Inputs"
    })
    return
   }
   try{
    const user = await prismaClient.user.create({
        data : {
         email : parsedData.data.username,
         password : parsedData.data.password,
         name : parsedData.data.name
        }
        })
        res.json({
         message : "Profile Created!",
         userId : user.id
        })
     
   } catch(err){
    res.status(411).json({
        message : "User already exists!"
    })

   }

})

app.post('/signin',async(req,res)=>{
    const parsedData = SigninSchema.safeParse(req.body)
    if(!parsedData.success){
     res.json({
         message : "Incorrect Inputs"
     })
     return
    }
    const user = await prismaClient.user.findFirst({
        where : {
            email : parsedData.data.username,
            password : parsedData.data.password
        }
    })
    if(!user){
        res.status(411).json({
            message  :"User doesnt exist"
        })
        return
    }
    const token = jwt.sign({
        userId : user.id
    },JWT_SECRET)

    res.json({
        token
    })

})

app.post('/room',middleware,async(req,res)=>{
    const parsedData = CreateRoomSchema.safeParse(req.body)
    if(!parsedData.success){
     res.json({
         message : "Incorrect Inputs"
     })
     return
    }
    //@ts-ignore
    const userId = req.userId

  try{
    const room =  await prismaClient.room.create({
        data : {
            slug : parsedData.data.name,
            adminId : userId

        }
    })
    res.json({
        roodId : room.id
    })
  }
  catch(err){
    res.status(403).json({
        message : "Room already exists"
    })
  }
    
})

app.get('/chats/:roomId',async(req,res)=>{
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where : {
            id : roomId
        },
        orderBy : {
            id : "desc"
        },
        take : 50
    });
    res.json({
        messages
    })


})









app.listen(3003)