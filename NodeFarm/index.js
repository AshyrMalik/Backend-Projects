fs = require("fs")
const http = require('http');
url = require("url")

///////////////////////////////////////////////////////////////
//File System

// //Blocking Synchronous Way 
// // textin=fs.readFileSync("./txt/input.txt","utf-8")
// // console.log(textin)
// // text_out= `This is what we know about: ${textin}`
// // fs.writeFileSync("./txt/output.txt",text_out)
// // console.log("output written to the file ")

// //Non Blocking Async way 
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data1) => {
//     console.log(data1);
//     fs.readFile("./txt/append.txt","utf-8",(err,data2)=>{
//         console.log(data2)
//         fs.writeFile("./txt/final.txt",`${data1}\n${data2}`,"utf-8",err=>{
//             console.log("File Written")
//         });
//     });
//   });
// });
// console.log("reading file")

///////////////////////////////////////////////////////////////
//Web Server

data=fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8" )
const productData = JSON.parse(data)


const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === '/' || pathName === '/overview') {
    res.end("This is the OVERVIEW");
  } else if (pathName === "/product") {
    res.end("This is the product page");
  } 
  else if (pathName === "/api") {
    res.writeHead(200,{"Content-type":"application/json"})
    res.end(data);
  } 
  else {
    res.end("Hello from the server");
  }
});

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});

