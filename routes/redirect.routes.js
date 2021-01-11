const {Router} = require('express')
const Link = require('../models/Link')
const router = Router()


router.get('/:code', async (req, res) => {
    try {

        const link = await Link.findOne({ code: req.params.code })

        if (link) {
            link.clicks++
            await link.save()
            return res.redirect(link.from)
        }

        res.status(404).json('Linkul nu este gasit')

    } catch (e) {
        res.status(500).json({ message: 'Ceva nu a mers, mai incercati ica o data' })
    }
})


module.exports = router