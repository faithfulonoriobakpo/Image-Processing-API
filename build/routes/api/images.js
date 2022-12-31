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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = require("fs");
const imageRoute = express_1.default.Router();
const images = [
    'encenadaport.jpg',
    'fjord.jpg',
    'icelandwaterfall.jpg',
    'palmtunnel.jpg',
    'santamonica.jpg',
];
const cachedImages = [];
const logRequests = (type, message) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield fs_1.promises.open('logs.txt', 'a+');
    yield file.write(`${type}: ${message}\n`);
});
imageRoute.get('/images', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        root: path_1.default.join(__dirname, '../../../'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
        },
    };
    const resizeWidth = Number(req.query.width);
    const resizeHeight = Number(req.query.height);
    const imageName = req.query.filename;
    try {
        if (!images.includes(`${imageName}.jpg`))
            throw new ReferenceError('Request not found');
        if (isNaN(resizeWidth) || isNaN(resizeHeight))
            throw new TypeError('Bad Request');
        const filePath = `assets/thumbs/${imageName}x${resizeHeight}x${resizeWidth}.jpg`;
        if (cachedImages.includes(`${imageName}x${resizeHeight}x${resizeWidth}.jpg`)) {
            res.status(200).sendFile(filePath, options, (err) => {
                if (err) {
                    next(err);
                    throw new Error(err.message);
                }
                logRequests('Image Processed', `${imageName}.jpg was successfully processed to ${imageName}x${resizeHeight}x${resizeWidth}.jpg at ${new Date()}`);
            });
        }
        else {
            yield (0, sharp_1.default)(`assets/images/${imageName}.jpg`)
                .resize({ width: resizeWidth, height: resizeHeight })
                .toFile(`assets/thumbs/${imageName}x${resizeHeight}x${resizeWidth}.jpg`);
            cachedImages.push(`${imageName}x${resizeHeight}x${resizeWidth}.jpg`);
            res.status(200).sendFile(filePath, options, (err) => {
                if (err) {
                    next(err);
                    throw new Error(err.message);
                }
                logRequests('Image Processed', `${imageName}.jpg was successfully processed to ${imageName}x${resizeHeight}x${resizeWidth}.jpg at ${new Date()}`);
            });
        }
    }
    catch (err) {
        if (err instanceof ReferenceError) {
            res.status(404).json({
                message: err.message,
            });
            logRequests('Error', `${err.message} at ${new Date()}`);
        }
        else if (err instanceof TypeError) {
            res.status(400).json({
                message: err.message,
            });
            logRequests('Error', `${err.message} at ${new Date()}`);
        }
        else {
            res.status(500).json({
                message: 'Something went wrong internally',
            });
            logRequests('Error', `Something went wrong internally at ${new Date()}`);
        }
    }
}));
exports.default = imageRoute;
