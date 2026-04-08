// require("dotenv").config();
// const { checkPrice } = require("./notifier");

// console.log("Monitor iniciado 🚀");

// // ejecuta inmediatamente
// checkPrice();

// // loop
// setInterval(() => {
//     checkPrice();
// }, 10 * 60 * 1000);

require("dotenv").config();
const { checkPrice } = require("./notifier");

(async () => {
    console.log("Running cron job...");

    await checkPrice();

    console.log("Done ✅");
    process.exit(0);
})();