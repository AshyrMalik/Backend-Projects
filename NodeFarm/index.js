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
const replaceTemplate= (temp,product)=>{
  let output= temp.replace(/{%PRODUCTNAME%}/g,product.productName)
  output= output.replace(/{%IMAGE%}/g,product.image)
  output= output.replace(/{%PRICE%}/g,product.price)
  output= output.replace(/{%FROM%}/g,product.from)
  output= output.replace(/{%NUTRIENTS%}/g,product.nutrients)
  output= output.replace(/{%QUANTITY%}/g,product.quantity)
  output= output.replace(/{%DESCRIPTION%}/g,product.description)
  output= output.replace(/{%ID%}/g,product.id)
  if (product.organic){
    output= output.replace(/{%NOT_ORGANIC%}/g,'not-organic')

  }
  return output
  
}


templateOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,"utf-8" )
templateCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,"utf-8" )
templateProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,"utf-8" )

data=fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8" )
const productData = JSON.parse(data)


const server = http.createServer((req, res) => {
  const {query,pathname}= url.parse(req.url,true)

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200,{"Content-type":"text/HTML"})
    const cardsHtml = productData.map(el => replaceTemplate(templateCard, el)).join('');

    const output = templateOverview.replace("{%PRODUCT_CARDS%}",cardsHtml)
    
    res.end(output)


  } else if (pathname === "/product") {
    res.writeHead(200,{"Content-type":"text/HTML"})
    const product=productData[query.id]
    output = replaceTemplate(templateProduct,product)
    res.end(output);
  } 
  else if (pathname === "/api") {
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

