const axios = require("axios");
const config = require("./config");

let accessToken = null;

async function getAccessToken() {
    const res = await axios.post(
        "https://oauth.battle.net/token",
        "grant_type=client_credentials",
        {
            auth: {
                username: config.blizzardClientId,
                password: config.blizzardSecret,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    accessToken = res.data.access_token;
    return accessToken;
}

async function getWowTokenPrice() {
    if (!accessToken) await getAccessToken();

    const res = await axios.get(
        "https://us.api.blizzard.com/data/wow/token/index",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                namespace: "dynamic-us",
                locale: "en_US",
            },
        }
    );

    return res.data.price;
}

module.exports = {
    getWowTokenPrice,
};