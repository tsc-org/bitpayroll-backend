const dotenv = require("dotenv");

dotenv.config();

const config  = {
    port: process.env.PORT,
}

export default config;