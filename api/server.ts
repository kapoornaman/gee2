// api/server.ts
import app from '../server/index';
import serverless from 'serverless-http';

export default serverless(app);
