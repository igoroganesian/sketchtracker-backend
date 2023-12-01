import express from 'express';
import lessonRoutes from '../routes/lessonRoutes';

const app = express();

app.use(express.json());
app.use('/api/lessons', lessonRoutes);

export default app;