const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

////////////////////////////////////
//Working with files and  Server!!!!

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const dataFromApi = fs.readFileSync(
  `${__dirname}/Sench-data/data.json`,
  "utf-8"
);

const dataObj = JSON.parse(dataFromApi);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview pages
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(" ");
    const outPut = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.end(outPut);
  }

  //Product pages
  else if (pathname === "/product") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    const product = dataObj[query.id];
    const outPut = replaceTemplate(tempProduct, product);
    res.end(outPut);
  }

  //Not Found  pages
  else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "hello world!",
    });
    res.end("<h1><i> Page not Found!!!</i></h1>");
  }
});

server.listen(8000, "localhost", () => {
  console.log("Listning for request on port 8000!");
});
