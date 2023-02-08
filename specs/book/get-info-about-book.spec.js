import book from "../helpers/book.js";

describe('Получение информации о книге GET /BookStore/v1/Book', () => {

    // let arrIsbn = [];
    // beforeAll(async () => arrIsbn = await book.getAllIsbn());

    test('Получение существующей книги', async () => {
        const response = await book.getBook();
        expect(response.status).toEqual(200);
        expect(response.body.isbn).toEqual(process.env.ISBN);
        expect(response.body.title).toEqual('Learning JavaScript Design Patterns');
        expect(response.body.author).toEqual('Addy Osmani');
    });

    test('Получение книги с неверным ISBN', async () => {
        const response = await book.getBook('test');
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({code: '1205', message: 'ISBN supplied is not available in Books Collection!'});
    });

    test.each`
    isbn          | statusAnswer
    ${'9781449325862'} | ${200}
    ${'9781449331818'} | ${200}
    ${'9781449337711'} | ${200}
    ${'9781449365035'} | ${200}
    ${'9781491904244'} | ${200}
    ${'9781491950296'} | ${200}
    ${'9781593275846'} | ${200}
    ${'9781593277574'} | ${200}
    ${'test'}          | ${400}
    ${'123'}           | ${400}
    ${'ISBN'}          | ${400}
    `('Проверка наличия книги с ISBN $isbn', async ({isbn, statusAnswer}) => {
        const response = await book.getBook(isbn);
        expect(response.status).toEqual(statusAnswer);
    });

    // test.each`
    // isbn          | statusAnswer
    // ${arrIsbn[0]} | ${200}
    // ${arrIsbn[1]} | ${200}
    // ${arrIsbn[2]} | ${200}
    // ${'test'}     | ${400}
    // ${'123'}      | ${400}
    // ${'ISBN'}     | ${400}
    // `('Проверка наличия книги с ISBN $isbn', async ({isbn, statusAnswer}) => {
    //     const response = await book.getBook(isbn);
    //     expect(response.status).toEqual(statusAnswer);
    // });

})