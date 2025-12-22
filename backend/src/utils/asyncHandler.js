const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err));
    };
};



export {asyncHandler}

/*
🔎 What asyncHandler is supposed to do??

In Express, route handlers can be async functions (using await).

If an async function throws an error or rejects a promise, Express won’t automatically catch it.

Normally, you’d have to wrap every route in try/catch and call next(err) manually.

***asyncHandler is a higher-order function (a function that returns another function) that automatically catches errors from async route handlers and forwards them to Express’s error middleware.***

✅ How it works
asyncHandler takes a requestHandler (your route function).

It returns a new function (req, res, next) => { ... }.

Inside, it wraps the handler in Promise.resolve(...).

If the handler throws or rejects, .catch(next) ensures the error is passed to Express’s error-handling middleware.

*/



// another way to write the above code as below
/*
// const asyncHandler = () => {}
// const asyncHandler = (fn) => () => {}
// const asyncHandler = (fn) => async () => {}



const asyncHandler = (fn) => async (req, res, next) => {
    try{
        await fn(req, res, next)
    }catch(err){
        res.status(err.code || 500).json({ 
            success: false,
            message: err.message,
        })
    }
}

*/