import express, { Request, Response, NextFunction, ErrorRequestHandler} from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

const jsonErrorHandler: ErrorRequestHandler = (err: SyntaxError, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ message: 'Invalid JSON payload' });
    return;
  }
  next();
};

app.use(jsonErrorHandler);

app.use('/tasks', tasksRouter);

app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});