const { createApp } = require("./app");

const PORT = Number(process.env.PORT || 5000);

const app = createApp();

app.listen(PORT, () => {
  console.log(`GitVerify backend listening on port ${PORT}`);
});
