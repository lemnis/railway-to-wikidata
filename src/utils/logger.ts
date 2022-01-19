import { pino } from "pino";
import ProgressBar from "progress";
import ora from 'ora';
import { LOG_LEVEL } from "../../environment";

export const logger = pino({
  level: LOG_LEVEL || 'info',
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