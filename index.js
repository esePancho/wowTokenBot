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
const cron = require("node-cron");
const { checkPrice } = require("./notifier");

console.log("Cron service started 🚀");

// cada 20 minutos (ejemplo)
cron.schedule("*/20 * * * *", async () => {
    console.log("Running cron job...");

    try {
        await checkPrice();
        console.log("Done ✅");
    } catch (err) {
        console.error("Error:", err);
    }
});