import express from 'express';
import User from '../models/user.js';

const router = express.Router();

function handleError(error, res) {
    console.log(error);
    res.status(400).send({ message: error.message });
}


router.route('/signup').get((req, res) => {
    res.render('user/signUp.ejs');
});

router.route('/login').get((req, res) => {
    res.render('user/login.ejs')  
});

        
router.route('/signup').post(async function (req, res) {
    try { 
        const { password, confirmPassword } = req.body;

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).send({
                message: 'Passwords do not match.'
            });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).send({
                message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.'
            });
        }

        // Create the new user
        const newUser = await User.create(req.body);
        res.redirect('/login');
    } catch (error) {
        console.error('Error creating user:', error.message);
        handleError(error, res);
    }
});

router.route("/user/logout").get(async function (req, res, next) {
  req.session.destroy();
  res.redirect("/");
});


// TODO login
// Login page (just like signup.ejs) ✅
// GET /login controller to return our ejs page ✅
// When you sign up, redirect to login ✅
router.get('/login', (req, res, next) => {
    try {
      res.render("user/login.ejs");
    } catch (error) {
      next(error, res)
    }  
  })
  
  // POST /login controller to handle POSTing the login.
  router.post('/login', async (req, res, next) => {
    try {
      // ? We need to know if the login was actually successful!
      // 1) Get the user for this login attempt (with email)
      const user = await User.findOne({ email: req.body.email })
      // 2) Compare the 2 password hashes to see if they're the same.
      // ! This will check if the login is a failure, and respond accordingly.
      if (!user.isPasswordValid(req.body.password)) {
        return res.status(401).send({ message: "Unauthorized"})
      }
  
      // If we succeed, we do this later:
      req.session.user = user // add the user to the current session 
      res.redirect('/')
  
    } catch(error) {
      handleError()
    }
  })

export default router;
