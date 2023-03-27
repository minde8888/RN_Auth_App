class NetworkError extends Error {
  statusCode: any;
  constructor(message: string | undefined, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default NetworkError;