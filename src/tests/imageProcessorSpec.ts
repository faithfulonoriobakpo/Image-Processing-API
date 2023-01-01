import supertest from "supertest";
import app from "../index";
import processImage from "../utilities/image-processor";
import path from "path";
import fs from "fs";

const request = supertest(app);
const thumbsDirectory = path.join(__dirname, '../../assets/thumbs');

describe('Test Images Processing', () => {
    it('Expects correct image api call to return 200', async () => {
        const response = await request.get('/api/images?filename=fjord&width=200&height=300');
        expect(response.status).toBe(200);
    });
    it('Expects processed image type to be jpeg', async () => {
        const response = await request.get('/api/images?filename=fjord&width=200&height=300');
        expect(response.type).toBe('image/jpeg');
    });
    it('Expects image-processor to process image to requested size and save in thumbs folder', async () => {
        await processImage('fjord', 360, 240);
        expect(fs.existsSync(`${thumbsDirectory}/fjordx360x240.jpg`)).toBeTrue();
    });
});
