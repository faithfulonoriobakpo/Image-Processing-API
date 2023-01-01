"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const image_processor_1 = __importDefault(require("../utilities/image-processor"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const request = (0, supertest_1.default)(index_1.default);
const thumbsDirectory = path_1.default.join(__dirname, '../../assets/thumbs');
describe('Test Images Processing', () => {
    it('Expects correct image api call to return 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/api/images?filename=fjord&width=200&height=300');
        expect(response.status).toBe(200);
    }));
    it('Expects processed image type to be jpeg', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/api/images?filename=fjord&width=200&height=300');
        expect(response.type).toBe('image/jpeg');
    }));
    it('Expects image-processor to process image to requested size and save in thumbs folder', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, image_processor_1.default)('fjord', 360, 240);
        expect(fs_1.default.existsSync(`${thumbsDirectory}/fjordx360x240.jpg`)).toBeTrue();
    }));
});
