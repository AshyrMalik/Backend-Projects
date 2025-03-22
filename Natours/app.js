const express = require('express');
const fs = require('fs');

const app = express()
app.use(express.json());

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
        results:tours.length,
        data:{
            tours
        }

    })
})

 app.post("/api/v1/tours",(req,res)=>{
    //console.log(req.body)
    new_id = tours[tours.length-1].id +1
    const new_Tour= Object.assign({id:new_id},req.body)
    tours.push(new_Tour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
        res.status(201).json({
            status:"Success",
            data:{
                tours : new_Tour
            }
        })
    })
    
 })

const port = 3000;


app.listen(port, ()=>{
    console.log(`App running on ${port} `)
});
