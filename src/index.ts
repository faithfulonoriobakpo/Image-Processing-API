import express from 'express';
import routes from './routes';

const app = express();
const port = 5000;

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server successfully started on port ${port}`);
});

export default app;