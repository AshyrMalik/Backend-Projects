const express = require('express');
const fs = require('fs');

const app = express()

// app.get("/",(req,res)=>{
//     res.status(200).json({message:'Hello from the server side ',app:'Natours'})


// })
// app.post('/',(req,res)=>{
//     res.send("You can post on this end point")
    
// })
tours=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get("/api/v1/tours",(req,res)=>{
    res.status(200).json({
        status:"success",
        data:{
            tours:tours
        }

    })
})

port = 3000;


app.listen(port, ()=>{
    console.log(`App running on ${port} `)
});
