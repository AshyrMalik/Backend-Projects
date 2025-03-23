exports.getAllTours = (req,res)=>{
    res.status(200).json({
        requestTime:req.reqTime,
        status:"success",
        results:tours.length,
        data:{
            tours
        }

    })
}
exports.getTour= (req,res)=>{
    console.log(req.params)
    const id = req.params.id *1;
    const tour = tours.find(el=>el.id === id)
    //if (id>tours.length){
    
    if (!tour){
        return res.status(404).json({
            status:"failed",
            message:"invalid id"
        })
    }
    res.status(200).json({
        status:"success",
        tour
    })
}

exports.deleteTour = (req,res)=>{
    
    if (req.params.id * 1 > tours.length){
        return res.status(404).json({
            status:"failed",
            message:"invalid id"
        })
    }

    res.status(204).json({
        status:"Success",
        data: null 

    })

}

exports.addNewTour=(req,res)=>{
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
    
 }

 exports.updateTour = (req,res)=>{
    res.status(500).json({
        status:"error",
        message:"This route is not yet implemented"
    })
 }
