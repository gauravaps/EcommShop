class customError extends Error{
    constructor( msg,sCode){
        super();
        this.message=msg;
        this.statusCode = sCode;
        

    }
}

export{customError};

