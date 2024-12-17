const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err)=>next(err))
    }

}

export {asyncHandler};
//-------------------learnings---------------------
//cont higherOrFunc = (func) => async() => {
// abc+xyz;
// return} just function me function then fucntion will be treated as a variable
//
// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({    .josn file aayega toh usko bhi handle kra lo
//             success: false,
//             message: err.message
//         })
//     }
// }

