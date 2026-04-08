const axios = require("axios");
const config = require("./config");
const { getWowTokenPrice } = require("./blizzard");


let lastPrice = null;

function formatGold(copper) {
    const gold = Math.floor(copper / 10000);

    return gold.toLocaleString("en-US");
}

async function sendToDiscord(message, price, lastPrice) {
    await axios.post(config.webhookUrl, {
        username: "WoW Token Bot 💰",
        embeds: [
            {
                title: "WoW Token Update",
                description: message,
                color: 5814783,

                footer: {
                    text: "Última actualización",
                },

                timestamp: new Date(),

                fields: [
                    {
                        name: "Precio anterior",
                        value: formatGold(lastPrice),
                        inline: true,
                    },
                    {
                        name: "Precio actual",
                        value: formatGold(price),
                        inline: true,
                    },
                ],
            },
        ],
    });
}

async function checkPrice() {
    try {
        const price = await getWowTokenPrice();
        const isUp = price > lastPrice;
        const color = isUp ? 0x00ff00 : 0xff0000; // verde o rojo

        console.log("Precio actual:", price);

        if (lastPrice && price < lastPrice) {
            await sendToDiscord(
                `💰 WoW Token bajó: ${formatGold(lastPrice)} → ${formatGold(price)} 📉`,
                price,
                lastPrice
            );
        }

        lastPrice = price;

    } catch (err) {
        console.error("Error:", err.message);
    }
}

module.exports = {
    checkPrice,
};