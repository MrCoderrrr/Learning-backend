// here we are making a apiResponse class that standardise the apiResponse
// defining a class
class apiResponse {
  //making a constructor to order the data
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = data;
  }
}

export { apiResponse };
