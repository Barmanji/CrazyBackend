class ApiResponse {
    constructor(statusCode, data, message = 'Success'){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400 //statusCode /ApiServer 101 read in MDN range of success coddes
    }
}
