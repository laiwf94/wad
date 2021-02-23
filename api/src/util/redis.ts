import Queue, { Job } from 'bull';
import { toNumber } from 'lodash';
import { MovieError } from '../middlewares/error';
import logger from './logger';

const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD, USE_REDIS, RETRY_TIMES, QUEUE_DELAY }: any = process.env;

export const initRedis = async () => {
	if (USE_REDIS !== 'true') return null;

	let queue: Queue.Queue<any> = null;
	let expectedCall = 0;
	let finishedCall = 0;
	let onFinishCallback: Function = null;

	queue = new Queue('download movies', {
		redis: {
			port: REDIS_PORT,
			host: REDIS_HOST,
			password: REDIS_PASSWORD,
		},
	});

	const cleanUp = async () => {
		await queue.clean(100, 'active');
		await queue.clean(100, 'completed');
		await queue.clean(100, 'failed');
		await queue.clean(100, 'delayed');
		await queue.clean(100, 'paused');
		await queue.empty();
		logger.info(await queue.getJobCounts());
		await queue.close(true);
		queue = null;
		expectedCall = null;
		finishedCall = null;
	};

	const queueStatus = await queue.count();

	if (queueStatus > 0) {
		await cleanUp();
		throw new MovieError('Please wait until the last job finished', 500, '');
	}

	const process = (callback: Function) => {
		queue.process(async (job: Job<any>, done: any) => {
			try {
				await callback(job.data);
				done();
			} catch (err) {
				done(err);
			}
		});
	};

	const add = (data: any, id: string) => {
		expectedCall++;
		queue.add(data, {
			attempts: toNumber(RETRY_TIMES) || 3,
			delay: toNumber(QUEUE_DELAY) || 100,
			backoff: toNumber(QUEUE_DELAY) || 100,
			jobId: id,
			timeout: 1000,
			removeOnComplete: true,
			removeOnFail: true,
		});
	};

	queue.on('completed', async (job: Job<any>) => {
		finishedCall++;
		logger.info(job.id + ' has completed - ' + finishedCall);
		if (finishedCall + 1 === expectedCall) {
			if (onFinishCallback) onFinishCallback();
			await cleanUp();
		}
	});

	queue.on('failed', async (job: Job<any>) => {
		if (job.attemptsMade === (toNumber(RETRY_TIMES) || 3)) finishedCall++;
		logger.info(job.id + ' has failed - ' + finishedCall);
		if (finishedCall + 1 === expectedCall) {
			if (onFinishCallback) onFinishCallback();
			await cleanUp();
		}
	});

	const finished = (callback: Function) => {
		onFinishCallback = callback;
	};

	return { queue, process, add, finished, cleanUp};
};
