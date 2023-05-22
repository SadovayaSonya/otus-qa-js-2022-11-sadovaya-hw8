import book from "../helpers/book.js";
import user from "../helpers/user.js";

describe('Добавление книги пользователю POST /BookStore/v1/Books', () => {

    let token = '';
    beforeAll(async () => token = await user.getAuthToken());
    afterEach(async () => await book.deleteBook(token));

    test('Добавление книги не авторизованному пользователю', async () => {
        const response = await book.addBookToUser('');
        expect(response.status).toEqual(401);
        expect(response.body).toEqual({code: '1200', message: 'User not authorized!'});
    });

    test('Успешное добавление книги авторизованному пользователю', async () => {
        const response = await book.addBookToUser(token);
        expect(response.status).toEqual(201);
        const arrIsbn = await user.getAllIsbnUser(process.env.USER_ID, token);
        expect(arrIsbn).toEqual([process.env.ISBN]);
    });

    test('Добавление книги с неверным ISBN авторизованному пользователю', async () => {
        const response = await book.addBookToUser(token, '123');
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({code: '1205', message: 'ISBN supplied is not available in Books Collection!'});
    });

    test('Добавление одной и той же книги дважды авторизованному пользователю', async () => {
        const res = await book.addBookToUser(token);
        expect(res.status).toEqual(201);
        const response = await book.addBookToUser(token);
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({code: '1210', message: "ISBN already present in the User's Collection!"});
    });

    test('Добавление нескольких книг авторизованному пользователю', async () => {
        const res = await book.addBookToUser(token);
        expect(res.status).toEqual(201);
        const response = await book.addBookToUser(token, process.env.ANOTHER_ISBN);
        expect(response.status).toEqual(201);
        const arrIsbn = await user.getAllIsbnUser(process.env.USER_ID, token);
        expect(arrIsbn).toEqual([process.env.ISBN, process.env.ANOTHER_ISBN]);
        await book.deleteBook(token, process.env.ANOTHER_ISBN);
    });

    test('Добавление всех книг из магазина авторизованному пользователю', async () => {
        const arrAllIsbnBookstore = await book.getAllIsbn();
        for (const isbn of arrAllIsbnBookstore) {
            const res = await book.addBookToUser(token, isbn);
            expect(res.status).toEqual(201);
        }
        const arrAllIsbnUser = await user.getAllIsbnUser(process.env.USER_ID, token);
        expect(arrAllIsbnUser).toEqual(arrAllIsbnBookstore);
        for (const isbn of arrAllIsbnUser) {
            const res = await book.deleteBook(token, isbn);
            expect(res.status).toEqual(204);
        }
    });

})