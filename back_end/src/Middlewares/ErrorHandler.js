const errorHandler = (err, res)=>{
    res.status(500).json({
        error: err.message
    })
}