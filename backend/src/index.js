const { createApp } = require("./app");
const { connectDatabase } = require("./database/connection");

const PORT = Number(process.env.PORT || 5000);

const app = createApp();

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`GitVerify backend listening on port ${PORT}`);
  });
}

startServer();
