import express from 'express';
import cors from 'cors';
import lessonRoutes from '../routes/lessonRoutes';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/lessons', lessonRoutes);

app.get('/', (req, res) => {
  res.send('Sketch Tracker');
});

export default app;