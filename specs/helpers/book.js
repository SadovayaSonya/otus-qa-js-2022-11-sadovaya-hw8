import supertest from "supertest";
import config from "../config.js";

const {url} = config;

// Контроллер book
const book = {
    // Получение списка книг
    getListBooks: () => {
        return supertest(url)
            .get('/BookStore/v1/Books')
            .set('Accept', 'application/json')
            .send();
    },
    // Получение книги
    getBook: (isbn = process.env.ISBN) => {
        return supertest(url)
            .get('/BookStore/v1/Book')
            .query({ISBN: `${isbn}`})
            .set('Accept', 'application/json')
            .send();
    },
    // Добавление книги пользователю
    addBookToUser: (token, isbn = process.env.ISBN, userId = process.env.USER_ID) => {
        return supertest(url)
            .post('/BookStore/v1/Books')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({userId: `${userId}`, collectionOfIsbns: [{isbn: `${isbn}`}]});
    },
    // Обновление книги у пользователя
    updateBook: (token, newIsbn, isbn = process.env.ISBN, userId = process.env.USER_ID) => {
        return supertest(url)
            .put(`/BookStore/v1/Books/${isbn}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({userId: `${userId}`, isbn: `${newIsbn}`});
    },
    // Удаление книги у пользователя
    deleteBook: (token, isbn = process.env.ISBN, userId = process.env.USER_ID) => {
        return supertest(url)
            .delete('/BookStore/v1/Book')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({userId: `${userId}`, isbn: `${isbn}`});
    },
    // Функция получения всех ISBN книг в магазине
    async getAllIsbn() {
        let arrIsbn = [];
        const res = await this.getListBooks();
        res.body.books.forEach(book => arrIsbn.push(book.isbn));
        return arrIsbn;
    }
}

export default book;