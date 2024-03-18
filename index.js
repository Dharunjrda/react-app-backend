import express from "express";
import { MongoClient } from 'mongodb';
import {ObjectId} from "mongodb";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const url = "mongodb+srv://dharunjrda2004:dharun162004@dharun.58xetjh.mongodb.net/?retryWrites=true&w=majority&appName=Dharun"
const client = new MongoClient(url);
await client.connect();
console.log("mongodb connected");

app.use(express.json());
app.use(cors());
const auth = (request,response,next) => {
    try{
        const token = request.header("backend-token");
        jwt.verify(token,"Dharun");
        next();
    } catch (error){
        response.status(401).send({message:error.message});
    }
}

app.get("/",function(request,response){
    response.status(200).send("Hello World!");
});

app.post("/post",async function(request,response){
    const getPostman = request.body;
    const sendMethod =await client.db("CRUD").collection("data").insertOne(getPostman);
    response.status(201).send(sendMethod);
    console.log(getPostman);
});

app.post("/postmany",async function(request,response){
    const getPostman = request.body;
    const sendMethod = await client.db("CRUD").collection("data").insertMany(getPostman);
    response.status(201).send(sendMethod);
});

app.get("/get",auth ,async function(request,response){
    const getMethod = await client.db("CRUD").collection("data").find({}).toArray();
    response.status(200).send(getMethod);
});

app.get("/getone/:id",async function(request,response){
    const {id} = request.params;
    const getMethod = await client.db("CRUD").collection("data").findOne({_id:new ObjectId(id)});
    response.status(200).send(getMethod);
});

app.put("/put/:id",async function(request,response){
    const {id} = request.params;
    const getPostman = request.body;
    const updateMethod = await client.db("CRUD").collection("data").updateOne({_id : new ObjectId(id)},{$set:getPostman});
    response.status(201).send(updateMethod);
});

app.delete("/delete/:id",async function(request,response){
    const {id} = request.params;
    const deleteMethod = await client.db("CRUD").collection("data").deleteOne({_id : new ObjectId(id)});
    response.status(200).send(deleteMethod);
})

app.post("/register",async function(request,response){
    const {username ,email ,password} = request.body;
    const userfind = await client.db("CRUD").collection("private").findOne({email:email});
    if(userfind) {
        response.status(400).send("User already exists");
    } else{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);
        console.log(hashedPass); 
        const registerMethod = await client.db("CRUD").collection("private").insertOne({username:username ,email:email ,password:hashedPass});  
        response.status(201).send(registerMethod);
    }
})

app.post("/login",async function(request,response){
    const {email, password} = request.body;
  //  console.log(email,password);
    const userfind = await client.db("CRUD").collection("private").findOne({email:email});
    if(userfind){
        const mongoDBpassword = userfind.password;
        const passwordCheck = await bcrypt.compare(password, mongoDBpassword);
        console.log(passwordCheck);
        if(passwordCheck){
            const token = jwt.sign({id:userfind._id}, "Dharun");
            response.status(200).send({token:token});
        }else{
            response.status(400).send("Invalid Password");
        }
    }
    else{
        response.status(400).send("login Failed - Invalid Email ID");
    }
}
)

app.listen(4000,()=>{
    console.log("sever connected");
})