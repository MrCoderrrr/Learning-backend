// we are making a standardised way of showing an error
// so we extend the error class
class apiError extends Error{
    //here we are making a constructor so that it is standardised form of getting error data 
    constructor(
        // we take status code
        statusCode,
        //than we take message which if not given than the below one is the default
        message= "something went wrong",
        //for multiple error
        error= [],
        // if you have stack than use this 
        statck =""
    ){
        //here we are overwritting the actual code of error class 
        // we are overwritting message
        super(message)
        // than statuscode
        this.statusCode = statusCode
        //than data
        this.data = null
        //than message 
        this.message = message
        //than success bool
        this.success = false;
        // than error 
        this.errors = errors

        if(statck){
            this.stack = statck
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export {apiError}