import * as trpc from '@trpc/server';
import { NextApiRequest, NextApiResponse } from 'next';

// Context object to be passed to your tRPC procedures
export interface Context {
  req: NextApiRequest;
  res: NextApiResponse;
}

export async function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<Context> {
  return {
    req,
    res,
  };
}

export type ContextType = trpc.inferAsyncReturnType<typeof createContext>; 