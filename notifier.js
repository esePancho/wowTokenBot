const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { getWowTokenPrice } = require("./blizzard");
const config = require("./config");

const DATA_FILE = path.join(__dirname, "data.json");

function readJSON() {
    if (!fs.existsSync(DATA_FILE)) {
        return { lastPrice: null, wasDown: false };
    }

    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    } catch {
        return { lastPrice: null, wasDown: false };
    }
}

function writeJSON(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

function getLastPrice() {
    return readJSON().lastPrice;
}

function saveLastPrice(price) {
    const data = readJSON();
    data.lastPrice = price;
    writeJSON(data);
}

function getWasDownState() {
    return readJSON().wasDown;
}

function saveWasDownState(value) {
    const data = readJSON();
    data.wasDown = value;
    writeJSON(data);
}


function formatGold(copper) {
    const gold = Math.floor(copper / 10000);

    return gold.toLocaleString("en-US");
}

async function sendToDiscord(message, price, lastPrice, color) {
    await axios.post(config.webhookUrl, {
        username: "WoWToken Bot 💰",
        embeds: [
            {
                title: "WoW Token Update",
                description: message,
                color,

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
        let wasDown = getWasDownState();

        const isUp = price > lastPrice;
        const color = isUp ? 0xff0000 : 0x00ff00;

        console.log("Precio actual:", price);

        if (lastPrice && price < lastPrice) {
            await sendToDiscord(
                `📉${formatGold(lastPrice)} → ${formatGold(price)}`,
                price,
                lastPrice,
                color
            );

            wasDown = true;

        } else if (lastPrice && price > lastPrice && wasDown) {
            await sendToDiscord(
                `📈${formatGold(lastPrice)} → ${formatGold(price)}`,
                price,
                lastPrice,
                color
            );

            wasDown = false;
        }

        saveWasDownState(wasDown);
        saveLastPrice(price);

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