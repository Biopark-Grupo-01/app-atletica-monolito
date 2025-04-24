import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.ENVIRONMENT || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
}));
