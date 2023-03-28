const { Router } = require('express');
const { validateJWT } = require('../middlewares/validateJWT.middleware');
const { login, googleSignin, renewToken } = require('../controllers/auth.controller');

const router = Router();

router.post('/login', login);

// router.post('/google',[
//     check('id_token', 'Id_token is mandatory').not().isEmpty(),
//     validateField
// ], googleSignin );

router.get('/', validateJWT, renewToken );

module.exports = router;