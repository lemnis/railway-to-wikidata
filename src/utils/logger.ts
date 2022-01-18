import { pino } from "pino";
import ProgressBar from "progress";
import ora from 'ora';

export const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

export  const progressBar = (title: string, size: number ) => new ProgressBar(
    `${title} [:bar] :current/:total :percent :elapseds`,
    { total: size }
  );


export { ora };