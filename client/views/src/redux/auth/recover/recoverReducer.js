export const recoverError = (err) => ({type:RECOVER_ERROR,payload:{loginError:'',signupError:'',recoverError:err}});
export const recoverRequest = () => ({type:RECOVER_REQUEST});
export const recoverSuccess = (userData)