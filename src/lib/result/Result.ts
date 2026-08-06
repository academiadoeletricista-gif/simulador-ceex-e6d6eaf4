export type Result<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: {
    message: string;
    code?: string | undefined;
    details?: any;
  };
};

export const ok = <T>(data: T): Result<T> => ({ success: true, data });
export const fail = (message: string, code?: string, details?: any): Result<any> => ({
  success: false,
  error: { 
    message, 
    code: code ?? undefined, 
    details: details ?? undefined 
  },
});
