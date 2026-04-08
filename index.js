require("dotenv").config();
const { checkPrice } = require("./notifier");

console.log("Monitor iniciado 🚀");

// ejecuta inmediatamente
checkPrice();

// loop
setInterval(() => {
    checkPrice();
}, 10 * 60 * 1000);