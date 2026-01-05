import { HttpInterceptorFn } from '@angular/common/http';

export const bigIntInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.body && hasBigInt(req.body)) {
    const serializedBody = JSON.parse(
      JSON.stringify(req.body, (key, value) =>
        typeof value === 'bigint' ? new Number(value.toString()) : value
      )
    );
    req = req.clone({ body: serializedBody });
  }
  return next(req);
};

function hasBigInt(obj: any): boolean {
  try {
    JSON.stringify(obj, (key, value) => {
      if (typeof value === 'bigint') throw new Error('hasBigInt');
      return value;
    });
    return false;
  } catch {
    return true;
  }
}