require("dotenv").config();
const http=require("https");
const axios=require("axios");
const express=require("express");
const path=require("path");
const {toDataURL}=require("qrcode");
const getLatestVideo = require("./controllers/youtube");
const fs=require("fs");
const app=express();
const PORT=process.env.PORT || 8000;
http.createServer(app);

// ---- middlewares
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));
// -- routes
app.get("/",async (req,res)=>{
    const getId=await getLatestVideo();
    fs.readFile("data/count.json",'utf-8',async(err,data)=>{
        if(err){
            console.log("Error in Reading Count");
            res.render("index",{"latest":getId,"count":{"visits":"null","download":"null"}});
        }
        const count=JSON.parse(data);
        count.visits+=1;
        fs.writeFile("./data/count.json",JSON.stringify(count,null,2),'utf-8',(err)=>{
            if(err){
                console.log("Error in Writing Count JSON");
            }
        });
        res.render("index",{"latest":getId,"count":count});
    });
});
app.post("/generate",(req,res)=>{
    const body=req.body;
    fs.readFile("data/count.json",'utf-8',(err,data)=>{
        if(err){
            console.log("Error in Reading Count");
        }
        var count=JSON.parse(data);
        count.download+=1;
        fs.writeFile("./data/count.json",JSON.stringify(count,null,2),'utf-8',(err)=>{
            if(err){
                console.log("Error in Writing Count JSON");
            }
        });
    });
    if(!body.url){
        return res.render("qr",{"error":"Invalid URL"});
    }
    toDataURL(body.url,(err,url)=>{
        if(err){
            //return res.render("qr",{"error":"Invalid URL"});
        return res.send("Error");
        }
        // --- pinping image
        res.render("qr",{"image":url});
    });
});
app.listen(PORT,()=>{console.log("Server Started");});