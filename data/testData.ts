export const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173';

export const credentials = {
  validUser: {
    email: 'maria@example.com',
    password: 'demo1234',
  },
  invalidUser: {
    email: 'ghost@example.com',
    password: 'demo1234',
  },
} as const;
