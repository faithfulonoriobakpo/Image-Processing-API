import express from 'express';
import path from 'path';
import sharp from 'sharp';

const imageRoute = express.Router();
const images: string[] = [
    'encenadaport.jpg',
    'fjord.jpg',
    'icelandwaterfall.jpg',
    'palmtunnel.jpg',
    'santamonica.jpg',
];
const cachedImages: string[] = [];

imageRoute.get('/images', async (req, res, next) => {
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
    const imageName = req.query.filename;

    try {
        if (!images.includes(`${imageName}.jpg`))
            throw new ReferenceError('Request not found');
        if (isNaN(resizeWidth) || isNaN(resizeHeight))
            throw new TypeError('Bad Request');

        const filePath = `assets/thumbs/${imageName}x${resizeHeight}x${resizeWidth}.jpg`;

        if (
            cachedImages.includes(
                `${imageName}x${resizeHeight}x${resizeWidth}.jpg`
            )
        ) {
            res.status(200).sendFile(filePath, options, (err) => {
                if (err) {
                    next(err);
                    // throw new Error(err.message);
                }
            });
        } else {
            await sharp(`assets/images/${imageName}.jpg`)
                .resize({ width: resizeWidth, height: resizeHeight })
                .toFile(
                    `assets/thumbs/${imageName}x${resizeHeight}x${resizeWidth}.jpg`
                );

            cachedImages.push(
                `${imageName}x${resizeHeight}x${resizeWidth}.jpg`
            );

            res.status(200).sendFile(filePath, options, (err) => {
                if (err) {
                    next(err);
                    // throw new Error(err.message);
                }
            });
        }
    } catch (err) {
        if (err instanceof ReferenceError) {
            res.status(404).json({
                message: err.message,
            });
        } else if (err instanceof TypeError) {
            res.status(400).json({
                message: err.message,
            });
        } else {
            res.status(500).json({
                message: 'Something went wrong internally',
            });
        }
    }
});

export default imageRoute;
