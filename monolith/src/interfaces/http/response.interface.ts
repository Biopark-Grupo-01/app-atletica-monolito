export interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  data?: T;
  links?: Array<{ rel: string; href: string; method: string }>;
  error?: string;
}

export class SuccessResponse<T> implements ApiResponse<T> {
  statusCode: number;
  message?: string;
  data?: T;
  links?: Array<{ rel: string; href: string; method: string }>;

  constructor(
    statusCode: number,
    data?: T,
    message?: string,
    links?: Array<{ rel: string; href: string; method: string }>,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.links = links;
  }
}

export class ErrorResponse implements ApiResponse<never> {
  statusCode: number;
  message?: string;
  error?: string;
  stack?: string;

  constructor(
    statusCode: number,
    message?: string,
    error?: string,
    stack?: string,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.stack = stack;
  }
}
