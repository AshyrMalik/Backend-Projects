const Emitter = require('events');

const myEmitter = new Emitter();

myEmitter.on("newSale",()=>{
    console.log("There was a new sale")

})

myEmitter.on("newSale",()=>{
    console.log("Customer Name ; Ashar ")
    
})


myEmitter.emit("newSale")

