import {promises as fsPromises} from "fs";

const logRequests = async (type:string, message:string): Promise<void> => {
    const file = await fsPromises.open('logs.txt', 'a+');
    await file.write(`${type}: ${message}\n`);
    file.close();
}

export default logRequests;