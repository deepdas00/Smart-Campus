class ApiResponse{
    constructor(statusCode, data, message = "Success"){
        this.statuscode = this.statuscode
        this.data = data
        this.mmessage = message
        this.success = statusCode < 400
    }
}


export {ApiResponse}