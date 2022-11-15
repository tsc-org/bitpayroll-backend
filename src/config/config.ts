const dotenv = require("dotenv");

dotenv.config();

export const config  = {
    secret: process.env.SECRET,
    port: process.env.PORT,
    email: process.env.EMAIL,
    emailKey: process.env.EMAIL_KEY,
}
