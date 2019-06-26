export class errorHandler extends Error {
  status: number;
  message: string;
  code: number
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
} 
