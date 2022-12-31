import supertest from "supertest";
import app from "../index";

const request = supertest(app);

describe('Test Endpoint Error Handling', () => {
    it('Expects wrong image name to return 404', async () => {
        const response = await request.get('/api/images?filename=wrongname&width=200&height=300');
        expect(response.status).toBe(404);
    });
    it('Expects NaN value for width or height to return 400',async () => {
        const response = await request.get('/api/images?filename=fjord&width=2h0&height=3dt');
        expect(response.status).toBe(400);
    });
});

describe('Test Images Processing', () => {
    it('Expects correct image api call to return 200', async () => {
        const response = await request.get('/api/images?filename=fjord&width=200&height=300');
        expect(response.status).toBe(200);
    });
    it('Expects processed image type to be jpeg', async () => {
        const response = await request.get('/api/images?filename=fjord&width=200&height=300');
        expect(response.type).toBe('image/jpeg');
    });
});