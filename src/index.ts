import express from 'express';
import imageRoute from './routes/api/images';

const app = express();
const port = 5000;

app.use('/api', imageRoute);

app.listen(port, () => {
    console.log(`Server successfully started on port ${port}`);
});

export default app;