export type ServiceSuccess<T> = {
  ok: true;
  message: string;
  data: T;
};

export type ServiceFailure<E extends string = string> = {
  ok: false;
  message: string;
  code: E;
  statusCode: number;
  error?: unknown;
};

export type ServiceResult<T, E extends string = string> =
  | ServiceSuccess<T>
  | ServiceFailure<E>;

