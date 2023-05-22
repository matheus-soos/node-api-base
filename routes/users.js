const User = require("../model/user");
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password } = req.body

        if (!(username && email && password)) {
            return res.status(400).send("Preenchas os campos obrigatórios")

        }

        const oldUser = await User.find({ email: email })

        if (oldUser) {
            return res.status(409).send("Usuário já existente")

        }

        const hash = await bcrypt.hash(password, 10)

        const user = await User.create({
            username: username,
            email: email.toLowerCase(),
            password: hash
        })

        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        user.token = token

        res.status(201).json(user)
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!(email && password)) {
            return res.status(400).send("Preencha os campos obrigatórios")
        }

        const user = await User.findOne({ email: email })

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;

            res.status(200).json(user);
        }
        else {
            res.status(400).send("Credenciais inválidas")
        }
    }
    catch (err) {
        console.log(err)
    }
})

module.exports = router
