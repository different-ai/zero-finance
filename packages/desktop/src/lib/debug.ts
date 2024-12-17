export const debug = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Debug]', ...args)
  }
} 