import express from 'express';
import fs from "fs";
import {promises as fsPromises} from "fs";
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import processImage from '../../utilities/image-processor';
import logRequests from '../../utilities/logger';

const imageRoute = express.Router();
const images: string[] = [
    'encenadaport.jpg',
    'fjord.jpg',
    'icelandwaterfall.jpg',
    'palmtunnel.jpg',
    'santamonica.jpg',
];
const cachedImages: string[] = [];

imageRoute.get('/images', async (req: Request, res:Response, next:NextFunction) => {
    const options = {
        root: path.join(__dirname, '../../../'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
        },
    };

    const resizeWidth = Number(req.query.width);
    const resizeHeight = Number(req.query.height);
    const imageName: string = req.query.filename as string;

    try {
        if (!images.includes(`${imageName}.jpg`))
            throw new ReferenceError('Request not found');
        if (isNaN(resizeWidth) || isNaN(resizeHeight))
            throw new TypeError('Bad Request');
        if (resizeWidth <= 0 || resizeHeight <=0 )
            throw new RangeError("Height and Width value must be above 0");

        const thumbsDirectory = path.join(__dirname, '../../../assets/thumbs');
        const filePath = `assets/thumbs/${imageName}x${resizeHeight}x${resizeWidth}.jpg`;

        if(!fs.existsSync(thumbsDirectory)) await fsPromises.mkdir(thumbsDirectory);

        if (
            cachedImages.includes(
                `${imageName}x${resizeHeight}x${resizeWidth}.jpg`
            )
        ) {
            res.status(200).sendFile(filePath, options, (err) => {
                if (err) {
                    next(err);
                    throw new Error(err.message);
                }
            });

            logRequests('Image Processed',`${imageName}.jpg was successfully processed to ${imageName}x${resizeHeight}x${resizeWidth}.jpg at ${new Date()}`);

        } else {

            await processImage(imageName, resizeWidth, resizeHeight);

            cachedImages.push(
                `${imageName}x${resizeHeight}x${resizeWidth}.jpg`
            );

            res.status(200).sendFile(filePath, options, (err) => {
                if (err) {
                    next(err);
                    throw new Error(err.message);
                }
            });

            logRequests('Image Processed',`${imageName}.jpg was successfully processed to ${imageName}x${resizeHeight}x${resizeWidth}.jpg at ${new Date()}`);

        }
    } catch (err) {
        if (err instanceof ReferenceError) {
            res.status(404).json({
                message: err.message,
            });
            logRequests('Error',`${err.message} at ${new Date()}`);
        } else if (err instanceof TypeError) {
            res.status(400).json({
                message: err.message,
            });
            logRequests('Error',`${err.message} at ${new Date()}`);
        } else if (err instanceof RangeError) {
            res.status(400).json({
                message: err.message,
            });
            logRequests('Error',`${err.message} at ${new Date()}`);
        }else {
            res.status(500).json({
                message: 'Something went wrong internally',
            });
            logRequests('Error',`Something went wrong internally at ${new Date()}`);
        }
    }
});

export default imageRoute;
