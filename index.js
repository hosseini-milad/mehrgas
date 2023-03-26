const http = require("http");
const app = require("./app");

const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

try{
// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
}
catch{
  console.log(`another server running on port ${port}`)
}