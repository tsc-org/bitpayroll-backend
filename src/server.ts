import express, {Express, Request, Response} from 'express';
import config from './config/config';


const app = express();
const port: String = config.port;

app.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
    }
);

app.listen(port, () => console.log(`App listening on port ${port}!`));
