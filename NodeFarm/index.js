fs = require("fs")
//Blocking Synchronous Way 
// textin=fs.readFileSync("./txt/input.txt","utf-8")
// console.log(textin)
// text_out= `This is what we know about: ${textin}`
// fs.writeFileSync("./txt/output.txt",text_out)
// console.log("output written to the file ")

//Non Blocking Async way 
fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
  fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data1) => {
    console.log(data1);
    fs.readFile("./txt/append.txt","utf-8",(err,data2)=>{
        console.log(data2)
        fs.writeFile("./txt/final.txt",`${data1}\n ${data2}`,"utf-8",err=>{
            console.log("File Written")
        });
    });
  });
});

console.log("reading file")
