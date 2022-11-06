const dotenv = require("dotenv");

dotenv.config();

export const config  = {
    secret: process.env.SECRET,
    port: process.env.PORT,
}
