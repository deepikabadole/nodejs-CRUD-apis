const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const path = require('path');
const db = require('./db');
const collection = "todo";

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/get-todos',(req,res)=>{
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err){
            console.log(err);
        }else{
            console.log(documents);
            res.json(documents);
        }
    })
});

app.post('/add-todo',(req,res)=>{
    const input = req.body;
    db.getDB().collection(collection).insert(input,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.json({result:result,document:result.ops[0]});
        }
    });
});
app.put('/update-todo/:id',(req,res)=>{
    const id = req.params.id;
    const input = req.body;
    db.getDB().collection(collection).findOneAndUpdate({_id:db.getPrimaryKey(id)},{$set:{todo:input.todo}},{returnOriginal:false},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.json({result:result,document:result});
        }
    });
});

app.delete('/delete-todo/:id',(req,res)=>{
    const id = req.params.id;
    db.getDB().collection(collection).findOneAndDelete({_id:db.getPrimaryKey(id)},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.json({result:result,document:result});
        }
    })
})



db.connect((err)=>{
    if(err){
        console.log("not connected");
        process.exit(1);
    }else{
        app.listen(3000,()=>{
            console.log("connected, app is listening at 3000");
        })
    }
})