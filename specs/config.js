require('dotenv').config();

const config = {
    url: process.env.BASE_URL,
    credentials: {
        userName: process.env.USERNAME,
        password: process.env.PASSWORD
    }
}

export default config;