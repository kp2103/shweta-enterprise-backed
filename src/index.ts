import './config/env.js';
import express from 'express';
import { env } from './config/env.js';
import { DB } from './config/dbConnect.js';
import authRouter from './routes/auth.routes.js';
import retailerRouter from './routes/retailer.routes.js';
import productRouter from './routes/products.routes.js';
import productCeretRouter from './routes/productCeret.routes.js';

const app = express();

const PORT = env.PORT;

// DB instance
DB.getInstance();

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/retailer', retailerRouter);
app.use('/api/products', productRouter);
app.use('/api/products-crate', productCeretRouter);

app.listen(PORT, () => console.log('🚀 Server is running on port', PORT));
