import book from "../helpers/book.js";
import user from "../helpers/user.js";

describe('Удаление книги у пользователя DELETE /BookStore/v1/Book', () => {

    let token = '';
    beforeAll(async () => token = await user.getAuthToken());
    beforeEach(async () => await book.addBookToUser(token));

    test('Удаление книги у не авторизованного пользователя', async () => {
        const response = await book.deleteBook('');
        expect(response.status).toEqual(401);
        expect(response.body).toEqual({code: '1200', message: 'User not authorized!'});
    });

    test('Успешное удаление книги у авторизованного пользователя', async () => {
        const response = await book.deleteBook(token);
        expect(response.status).toEqual(204);
    });

    test('Удаление одной и той же книги дважды у авторизованного пользователя', async () => {
        const res = await book.deleteBook(token);
        expect(res.status).toEqual(204);
        const response = await book.deleteBook(token);
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({code: '1206', message: "ISBN supplied is not available in User's Collection!"});
    });

    test('Удаление книги с неверным ISBN у авторизованного пользователя', async () => {
        const response = await book.deleteBook(token, '123');
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({code: '1206', message: "ISBN supplied is not available in User's Collection!"});
    });

    test('Удаление книги у пользователя с неверным UUID', async () => {
        const response = await book.deleteBook(token, process.env.ISBN, 'UUID');
        expect(response.status).toEqual(401);
        expect(response.body).toEqual({code: '1207', message: 'User Id not correct!'});
    });

    test('Удаление всех книг у авторизованного пользователя', async () => {
        await book.addBookToUser(token, process.env.ANOTHER_ISBN);
        let arrIsbnUser = await user.getAllIsbnUser(process.env.USER_ID, token);
        for (const isbn of arrIsbnUser) {
            const res = await book.deleteBook(token, isbn);
            expect(res.status).toEqual(204);
        }
        arrIsbnUser = await user.getAllIsbnUser(process.env.USER_ID, token);
        expect(arrIsbnUser).toEqual([]);
    });

})