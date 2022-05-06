const registerUser = (req, res) => {
    console.log(req.body)
    
    res.send('Register Route')
}

const loginUser = (req, res) => {
    res.send('Login Route')
}

module.exports = {
    registerUser,
    loginUser,
}