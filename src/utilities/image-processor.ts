import sharp from "sharp";

const processImage = async (imageName:string, resizeHeight: number, resizeWidth:number): Promise<void> => {

    await sharp(`assets/images/${imageName}.jpg`)
                .resize({ width: resizeWidth, height: resizeHeight })
                .toFile(
                    `assets/thumbs/${imageName}x${resizeHeight}x${resizeWidth}.jpg`
                );
}

export default processImage;