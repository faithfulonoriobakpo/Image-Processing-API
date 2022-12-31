import supertest from "supertest";
import app from "../index";

const request = supertest(app);

describe('Test Endpoint Error Handling', () => {
    it('Expects wrong image name to return 404', async () => {
        const response = await request.get('/api/images?filename=wrongname&width=200&height=300');
        expect(response.status).toBe(404);
    });
});