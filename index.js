/**
 * A Node.JS webserver that will connect to some database.
 *
 * This wil host an flight managing system.
 *
 * This is developed as the final project of CPSC471 at the University of
 * Calgary
 */

const http = require("http");
const fs = require("fs");
const url = require("url");

const PORT = 8000
const ROOT = process.env.ROOT || "./public";

function send404(response){
  response.writeHead(404, {"Content-Type": "text/html"});
  response.write("<h1>Error 404</h1><p>Page not found</p>");
  response.end();
}

function getHTML(reqPath, response){
  let filePath = `${ROOT}${reqPath}`;
  
  if(reqPath === '/') filePath = `${ROOT}/index.html`;

  fs.readFile(filePath, (err, data) => {
    if(err){
      response.errMsg = err;
      send404(response);
      return;
    }

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(data);
    response.end();
  });
}

function getCSS(reqPath, response){
  let filePath = `${ROOT}${reqPath}`;

  fs.readFile(filePath, (err, data) => {
    if(err){
      response.errMsg = err;
      send404(response);
      return;
    }

    response.writeHead(200, {"Content-Type": "text/css"});
    response.write(data);
    response.end();
  });
}

function getJS(reqPath, response){
  let filePath = `${ROOT}${reqPath}`;

  fs.readFile(filePath, (err, data) => {
    if(err){
      response.errMsg = err;
      send404(response);
      return;
    }

    response.writeHead(200, {"Content-Type": "application/javascript"});
    response.write(data);
    response.end();
  });
}

function onRequest(request, response){
  let urlInfo = url.parse(request.url, true);
  // Request path on urlInfo.pathname
  // Request path on urlInfo.query

  let reqBody = "";

  request.on("data", (chunk) => {
    reqBody += chunk;
  });

  request.on("end", () => {
    if(request.method === "GET"){
      switch(urlInfo.pathname){
        case("/"):
        case("/index.html"):
        case("/login.html"):
        case("/signup.html"):
        case("/search.html"):
          getHTML(urlInfo.pathname, response);
          break;
        case("/css/styles.css"):
        case("/css/search.css"):
          getCSS(urlInfo.pathname, response);
          break;
        case("/js/search.js"):
        case("/js/home.js"):
          getJS(urlInfo.pathname, response);
          break;
        default:
          send404(response);
      }
    }

    if(request.method === "POST"){
      switch(urlInfo.pathname){
        default:
          send404(response);
      }
    }
  });

  response.on("close", () => {
    let curDate = new Date().toISOString();
    console.log(`[${curDate}] ${request.method} request to ${urlInfo.href} - ${response.statusCode}`);

    if(reqBody) console.log(`-- ${reqBody}`);
    if(!!response.errMsg) console.error(`[err] ${response.errMsg.message}`);
  });
}

http.createServer(onRequest).listen(PORT);
console.log(`[info] server started on port ${PORT} with ROOT=${ROOT}`);
