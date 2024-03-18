import express from "express";
import { MongoClient } from 'mongodb';
import {ObjectId} from "mongodb";

const app = express();
const url = "mongodb+srv://dharunjrda2004:dharun162004@dharun.58xetjh.mongodb.net/?retryWrites=true&w=majority&appName=Dharun"
const client = new MongoClient(url);
await client.connect();
console.log("mongodb connected");

app.use(express.json());

app.get("/",function(request,response){
    response.send("Hello World!");
});

app.post("/post",async function(request,response){
    const getPostman = request.body;
    const sendMethod =await client.db("CRUD").collection("data").insertOne(getPostman);
    response.send(sendMethod);
    console.log(getPostman);
});

app.post("/postmany",async function(request,response){
    const getPostman = request.body;
    const sendMethod = await client.db("CRUD").collection("data").insertMany(getPostman);
    response.send(sendMethod);
});

app.get("/get",async function(request,response){
    const getMethod = await client.db("CRUD").collection("data").find({}).toArray();
    response.send(getMethod);
});

app.get("/getone/:id",async function(request,response){
    const {id} = request.params;
    const getMethod = await client.db("CRUD").collection("data").findOne({_id:new ObjectId(id)});
    response.send(getMethod);
});

app.put("/update/:id",async function(request,response){
    const {id} = request.params;
    const getPostman = request.body;
    const updateMethod = await client.db("CRUD").collection("data").updateOne({_id : new ObjectId(id)},{$set:getPostman});
    response.send(updateMethod);
});

app.delete("/delete/:id",async function(request,response){
    const {id} = request.params;
    const deleteMethod = await client.db("CRUD").collection("data").deleteOne({_id : new ObjectId(id)});
    response.send(deleteMethod);
})

app.listen(4000,()=>{
    console.log("sever connected");
})