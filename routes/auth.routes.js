const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()
const jwt = require('jsonwebtoken')
const config = require('config')


// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'email incorect').isEmail(),
        check('password', 'Lungimea minima 6 simboluri').isLength({ min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Datele au fost introduse incorect'
            })
        }

        const { email, password } = req.body

        const candidate = await User.findOne({ email })

        if(candidate){
            return res.status(400).json({ message: 'Deja exista un asemenea user'})
        }

        const hashedPassWord = await bcrypt.hash(password, 12)
        const user = new User({ email, password: hashedPassWord })

        await user.save()

        res.status(201).json({message: 'Userul a fost creat'})


    } catch (e) {
        res.status(500).json({ message: 'Ceva nu a mers, mai incercati odata'})
    }

})

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Introduceti un email corect').normalizeEmail().isEmail(),
        check('password', 'Introduceti parola').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Datele au fost introduse incorect'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({email})

            if(!user) {
                return res.status(400).json({message: 'Userul nu a fost gasit'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch){
                return res.status(400).json({message: 'Parola incorecta'})
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            )

            res.json({token, userId: user.id})

        } catch (e) {
            res.status(500).json({ message: 'Ceva nu a mers, mai incercati ica o data'})
        }

})

module.exports = router