const dotenv = require("dotenv");

dotenv.config();

export const config  = {
    secret: process.env.SECRET,
    port: process.env.PORT,
    email: process.env.EMAIL,
    pass: process.env.PASS,
}
