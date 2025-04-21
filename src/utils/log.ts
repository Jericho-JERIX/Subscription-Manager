export function createLogMessage({title,message}:{title:string,message:string}) {
    // Get timestamp with GMT+7
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
    console.log(`[${timestamp}] [${title}]: ${message}`);
}
