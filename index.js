const fs = require("fs");
const http = require("http");
const url = require("url");

//////////////////////
// FILE FS

// blocking code execution => synchronous
// const textIn = fs.readFileSync('./txt/read-this.txt', 'utf-8');
// console.log(textIn);

// const textOut = 'ini tuh penjelasan tentang alpukat di bahasa inggris : ${textIn}';
// fs.writeFileSync('./txt/output-penjelasan.txt', textOut);
// console.log('sukses nyetak data avocado!');

// non-blocking code execution => asynchronous
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   fs.readFile("./txt/${data}.txt", "utf-8", (err, data2) => {
//     fs.readFile("./txt/final.txt", "utf-8", (err, data3) => {

//     fs.writeFile("./txt/gabungan.txt", "${data}\n$(data2)", (err) => {
//       console.log("sukses menggabungkan data");

//     fs.writeFile('./txt/gabungan-read-this.txt', "${data}\n$(data3)", (err) => {
//         console.log("gabungan data")

//     });
//      });
//     });
//   });
// });
// console.log("hai FSW 2 menunggu");

//////////////////
// SERVER DENGAN HTTP
const replaceTemplate = (template, product) => {
  console.log(product)
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%ID%}/g, product.id);

  if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, `not-organic`);
  return output;
}

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, `utf-8`);
const dataOBj = JSON.parse(data);

const overviewPage = fs.readFileSync(`${__dirname}/templates/overview.html`, `utf-8`);
const productTemplate = fs.readFileSync(`${__dirname}/templates/product.html`, `utf-8`);
const productCardTemplate = fs.readFileSync(`${__dirname}/templates/template-card.html`, `utf-8`);

const server = http.createServer((req, res) => {
  // let = url.parse(req.url, true). pathname;
  const {query} = url.parse(req.url, true).query;
  const pathName = req.url;
  console.log(pathName)

  // HELLO PAGE
  if (pathName === "/hello") {
    res.end("ini hello ke FSW 2");

  // PRODUCT PAGE
  } else if (pathName === "/product") {
    res.end(JSON.stringify({
        data: "ini product",
      }));

  // SIMPLE API
    } else if (pathName === '/api'){
      res.writeHead(200, {
        "content-type" : "application/json",
    });
    res.end(data);

  // OVERVIEW PAGE 
    } else if (pathName === '/overview') {
      res.writeHead(200, {
        "content-type" : `text.html`,
      });

      const productCardHtml = dataOBj.map(el => replaceTemplate(productCardTemplate, el));
      const output = overviewPage.replace(`%PRODUCT_CARDS%`, productCardHtml)
      res.end(output);

      

  // TIDAK ADA APA APA
  } else {
    res.writeHead(404, {  
      "content-type" : "text/html",
    });
    res.end("<h1>url ini gak ada apa2</h1>");
  }

});

server.listen(8000, "127.0.0.1", () => {
  console.log("Hello Server nya Jalan!!!");
});
