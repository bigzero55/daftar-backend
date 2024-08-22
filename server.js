const app = require("./app");
require("dotenv").config();

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => {
  console.log(`Server Berjalan ${host + ":" + port}`);
});
