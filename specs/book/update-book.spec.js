import book from "../helpers/book.js";
import user from "../helpers/user.js";

describe('Обновление книги у пользователя PUT /BookStore/v1/Books/{ISBN}', () => {

    let token = '';
    beforeAll(async () => {
        token = await user.getAuthToken();
        await book.addBookToUser(token)
    });

    test('Обновление книги у не авторизованного пользователя', async () => {
        const response = await book.updateBook('', process.env.ANOTHER_ISBN);
        expect(response.status).toEqual(401);
        expect(response.body).toEqual({code: '1200', message: 'User not authorized!'});
    });

    test('Успешная замена книги', async () => {
        const response = await book.updateBook(token, process.env.ANOTHER_ISBN);
        expect(response.status).toEqual(200);
        expect(response.body.userId).toEqual(process.env.USER_ID);
        const arrIsbnUser = await user.getAllIsbnUser(process.env.USER_ID, token);
        expect(arrIsbnUser).toEqual([process.env.ANOTHER_ISBN]);
        await book.deleteBook(token, process.env.ANOTHER_ISBN);
    });

    test('Обновление книги у пользователя с неверным UUID', async () => {
        const response = await book.updateBook(token, process.env.ANOTHER_ISBN, process.env.ISBN, 'UUID');
        expect(response.status).toEqual(401);
        expect(response.body).toEqual({code: '1207', message: 'User Id not correct!'});
    });

    test('Обновление книги с неверным ISBN в path', async () => {
        const response = await book.updateBook(token, process.env.ANOTHER_ISBN, 'ISBN');
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({code: '1206', message: "ISBN supplied is not available in User's Collection!"});
    });

    test('Обновление книги с неверным ISBN в body', async () => {
        const response = await book.updateBook(token, 'ISBN');
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({code: '1205', message: 'ISBN supplied is not available in Books Collection!'});
    });

    test('Замена книги, которой нет у пользователя', async () => {
        const response = await book.updateBook(token, process.env.ISBN, process.env.ANOTHER_ISBN);
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({code: '1206', message: "ISBN supplied is not available in User's Collection!"});
    });

})