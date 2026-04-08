const fs = require("fs");
const axios = require("axios");
const { getWowTokenPrice } = require("./blizzard");
const config = require("./config");


function getLastPrice() {
    try {
        return JSON.parse(fs.readFileSync("price.json")).price;
    } catch {
        return null;
    }
}

function savePrice(price) {
    fs.writeFileSync("price.json", JSON.stringify({ price }));
}


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
        const lastPrice = getLastPrice();
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

        // if (lastPrice && price > lastPrice) {
        //     await sendToDiscord(
        //         `💰 WoW Token subió: ${formatGold(lastPrice)} → ${formatGold(price)} 📈`,
        //         price,
        //         lastPrice
        //     );
        // }

        // await sendToDiscord(
        //     `💰 WoW Token: ${formatGold(price)}`,
        //     price,
        //     lastPrice
        // );

        savePrice(price);

    } catch (err) {
        console.error("Error:", err.message);
    }
}

module.exports = {
    checkPrice,
};