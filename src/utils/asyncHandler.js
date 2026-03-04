// this is a functio that takes a function, wrpas araound a promise and returns it
// requestHandler is the function that is to be wraped
const asyncHandler = (requestHandler) => {
  //returns a function that is made below in which the req, res, next is filled by express itself
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

//exporting it
export { asyncHandler };

/*
const asyncHandler = () => {}
const asyncHandler = () => {()=> {}}
const asyncHandler = () => () => {}
*/

// const asyncHandler = (fn) => async (req,res,next) => {
//     try {

//     } catch (error) {
//         res.status(error.code||500).json({
//             success:false,
//             message: error.message
//         })
//     }
// }
