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

app.post('/signin',(req,res)=>{
    const data = SigninSchema.safeParse(req.body)
    if(!data.success){
     res.json({
         message : "Incorrect Inputs"
     })
     return
    }

})

app.post('/room',(req,res)=>{
    const data = CreateRoomSchema.safeParse(req.body)
    if(!data.success){
     res.json({
         message : "Incorrect Inputs"
     })
     return
    }
    
})









app.listen(3003)