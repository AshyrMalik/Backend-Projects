fs = require("fs")
//Blocking Synchronous Way 
textin=fs.readFileSync("./txt/input.txt","utf-8")
console.log(textin)
text_out= `This is what we know about: ${textin}`
fs.writeFileSync("./txt/output.txt",text_out)
console.log("output written to the file ")


//