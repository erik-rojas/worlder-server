const CronJob = require('cron').CronJob
const shell = require('shelljs');
const {
    backupJob: backupJobConfig,
} = require('./config')

stopJob = (job) => job.stop();
startJob = (job) => job.start();

module.exports = () => {
    let times = backupJobConfig.cronTime;
    let jobs = times.map(cronTime => {
        return new CronJob({
            cronTime,
            onTick: async () => {
                if (process.env.NODE_ENV != 'development') {
                    console.log('Job backup DB is running...');
                    try {
                        await shell.exec('npm run start:backup');
                    } catch (er) {
                        console.log('Job backup DB has error', er.message);
                    }
                    console.log('Job backup DB finished');
                }
            },
            start: true,
            // timeZone: 'Asia/Ho_Chi_Minh'
        })
    })

    return {
        start: () => {
            jobs.forEach(startJob)
        },
        stop: () => {
            jobs.forEach(stopJob)
        }
    }
}