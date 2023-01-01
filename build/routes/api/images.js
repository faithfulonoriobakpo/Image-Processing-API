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
const fs_1 = __importDefault(require("fs"));
const fs_2 = require("fs");
const path_1 = __importDefault(require("path"));
const image_processor_1 = __importDefault(require("../../utilities/image-processor"));
const logger_1 = __importDefault(require("../../utilities/logger"));
const imageRoute = express_1.default.Router();
const images = [
    'encenadaport.jpg',
    'fjord.jpg',
    'icelandwaterfall.jpg',
    'palmtunnel.jpg',
    'santamonica.jpg',
];
const cachedImages = [];
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
        if (resizeWidth <= 0 || resizeHeight <= 0)
            throw new RangeError("Height and Width value must be above 0");
        const thumbsDirectory = path_1.default.join(__dirname, '../../../assets/thumbs');
        const filePath = `assets/thumbs/${imageName}x${resizeHeight}x${resizeWidth}.jpg`;
        if (!fs_1.default.existsSync(thumbsDirectory))
            yield fs_2.promises.mkdir(thumbsDirectory);
        if (cachedImages.includes(`${imageName}x${resizeHeight}x${resizeWidth}.jpg`)) {
            res.status(200).sendFile(filePath, options, (err) => {
                if (err) {
                    next(err);
                    throw new Error(err.message);
                }
            });
            (0, logger_1.default)('Image Processed', `${imageName}.jpg was successfully processed to ${imageName}x${resizeHeight}x${resizeWidth}.jpg at ${new Date()}`);
        }
        else {
            yield (0, image_processor_1.default)(imageName, resizeWidth, resizeHeight);
            cachedImages.push(`${imageName}x${resizeHeight}x${resizeWidth}.jpg`);
            res.status(200).sendFile(filePath, options, (err) => {
                if (err) {
                    next(err);
                    throw new Error(err.message);
                }
            });
            (0, logger_1.default)('Image Processed', `${imageName}.jpg was successfully processed to ${imageName}x${resizeHeight}x${resizeWidth}.jpg at ${new Date()}`);
        }
    }
    catch (err) {
        if (err instanceof ReferenceError) {
            res.status(404).json({
                message: err.message,
            });
            (0, logger_1.default)('Error', `${err.message} at ${new Date()}`);
        }
        else if (err instanceof TypeError) {
            res.status(400).json({
                message: err.message,
            });
            (0, logger_1.default)('Error', `${err.message} at ${new Date()}`);
        }
        else if (err instanceof RangeError) {
            res.status(400).json({
                message: err.message,
            });
            (0, logger_1.default)('Error', `${err.message} at ${new Date()}`);
        }
        else {
            res.status(500).json({
                message: 'Something went wrong internally',
            });
            (0, logger_1.default)('Error', `Something went wrong internally at ${new Date()}`);
        }
    }
}));
exports.default = imageRoute;
