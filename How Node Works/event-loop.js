const fs = require('fs');
const crypto = require('crypto');


setTimeout(()=>console.log("Timer 1 set out"),0);
setImmediate(()=>console.log("Set immediate 1 executed"))


fs.readFile("test-file.txt",'utf-8',(err,data)=>{
    console.log("i/o finished")
    setTimeout(()=>console.log("Timer2 set out"),0);
    setTimeout(()=>console.log("Timer3 set out"),3000);
    setImmediate(()=>console.log("Set immediate executed"))
    
    process.nextTick(()=>console.log("NXT TICK "))
    crypto.pbkdf2("Password","salt",10000,1024,"sha512",()=>{
        console.log("Password generated ");
        
    })

})


console.log("Hello from top level code ")