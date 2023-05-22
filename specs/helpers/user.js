import supertest from "supertest";
import config from "../config.js";

const {url} = config;

// Контроллер user
const user = {
    // Регистрация пользователя
    registrationUser: (payload = config.credentials) => {
        return supertest(url)
            .post('/Account/v1/User')
            .set('Accept', 'application/json')
            .send(payload);
    },
    // Генерация токена
    generateToken: (payload = config.credentials) => {
        return supertest(url)
            .post('/Account/v1/GenerateToken')
            .set('Accept', 'application/json')
            .send(payload);
    },
    // Проверка авторизован ли пользователь
    authorizationUser: (payload = config.credentials) => {
        return supertest(url)
            .post('/Account/v1/Authorized')
            .set('Accept', 'application/json')
            .send(payload);
    },
    // Получение информации о пользователе
    infoUser: (uuid, token = '') => {
        return supertest(url)
            .get(`/Account/v1/User/${uuid}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();
    },
    // Удаление пользователя
    deleteUser: (uuid, token = '') => {
        return supertest(url)
            .delete(`/Account/v1/User/${uuid}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();
    },
    // Функция получения токена
    async getAuthToken() {
        const res = await this.generateToken();
        return res.body.token;
    },
    // Функция получения UserID при регистрации
    async getUserId() {
        const res = await this.registrationUser();
        return res.body.userID;
    },
    // Функция получения всех ISBN книг у пользователя
    async getAllIsbnUser(userId, token) {
        let arrIsbn = [];
        const res = await this.infoUser(userId, token);
        res.body.books.forEach(book => arrIsbn.push(book.isbn));
        return arrIsbn;
    }
}

export default user;