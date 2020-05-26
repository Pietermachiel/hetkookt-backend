const auth = require("../middleware/auth"); // authorisation (not authentication, validating password)
const mailtemplate = require("../mail/mailtemplate");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../models/user");
var nodemailer = require("nodemailer");
var sgTransport = require("nodemailer-sendgrid-transport");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id)
    // .populate("recipes", "title author basics tags isOpen dish, recipes")
    .select("-password -__v");
  res.send(user);
});

router.get("/", async (req, res) => {
  const users = await User.find()
    .populate("recipes", "favorites", "stock", "title author active")
    .select("-__v -password -email")
    .sort("name");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    temporarytoken: jwt.sign(
      {
        _id: req.body._id,
        name: req.body.name,
        email: req.body.email,
      },
      config.get("jwtPrivateKey"),
      {
        expiresIn: 12000,
      }
    ),
  });

  var options = {
    auth: {
      api_user: process.env.EMAIL_USER,
      api_key: process.env.EMAIL_PASSWORD,
    },
  };

  var client = nodemailer.createTransport(sgTransport(options));

  var email = {
    from: "support@hetkookt.nl",
    to: user.email,
    subject: "Welkom bij hetKookt",
    text: "Welkom bij hetKookt",
    html: mailtemplate(user.name, user.temporarytoken),

    // html: `<h1 style="color: red;">hetkookt</h1><br>
    // <p style="font-weight: normal">Welkom<strong> ${user.name}</strong>,<br><br>Bevestig je inschrijving door op onderstaande link te klikken: </p>
    // <button style="
    // background-color: #407afc;
    // color: #fff;
    // text-transform: uppercase;
    // text-align: center;
    // font-weight: 500;
    // padding: 1.5rem 2rem;
    // display: inline-block;
    // border-radius: 2px;
    // border: 1px solid transparent;
    // letter-spacing: .1em;
    // font-size: .75rem;
    // line-height: 1;">
    // <a style="color: white; text-decoration: none;" href="http://localhost:3000/verify/${user.temporarytoken}">Bevestig mijn inschrijving</a>
    // </button>`,
    // templateId: "d-96cc73c046b244f8b7c15f3938b4906b",
    // dynamic_template_data: {
    //   name: user.name,
    // },
  };

  console.log(client);

  client.sendMail(email, function (err, info) {
    if (err) {
      console.log(error);
    } else {
      console.log("Message sent: " + info.response);
    }
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  console.log(user);
  // res.send(user);
  const token = user.generateAuthToken(); // = method user model
  // console.log(token);

  res
    .header("x-auth-token", token)
    // add a header so the user can read a costum header
    // access-control-expose-headers= whitelist, x-auth-token= costum header
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email", "active", "temporarytoken"]));
});

router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    {
      new: true,
    }
  );
  res.send(user);
});

router.put("/favorites/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      favorites: req.body.favorites,
    },
    {
      new: true,
    }
  );
  console.log("plus");
  res.send(user);
});

// router.put("/favminus/:id", async (req, res) => {
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     {
//       favorites: req.body.favorites,
//     },
//     {
//       new: true,
//     }
//   );
//   console.log("minus");
//   res.send(user);
// });

router.put("/recipes/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      recipes: req.body.recipes,
    },
    {
      new: true,
    }
  );
  console.log("plus");
  res.send(user);
});

// router.put("/recminus/:id", async (req, res) => {
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     {
//       recipes: req.body.recipes,
//     },
//     {
//       new: true,
//     }
//   );
//   console.log("minus");
//   res.send(user);
// });

router.put("/stock/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      stock: req.body.stock,
    },
    {
      new: true,
    }
  );
  console.log("plus");
  res.send(user);
});

// Route to activate the user's account
router.put("/verify/:token", (req, res) => {
  User.findOne({ temporarytoken: req.params.token }, (err, user) => {
    if (err) throw err; // Throw error if cannot login
    const token = req.params.token; // Save the token from URL for verification
    console.log("Verified token:", token);
    // Function to verify the user's token
    // console.log(user);
    jwt.verify(token, config.get("jwtPrivateKey"));
    // user.temporarytoken = false; // Remove temporary token
    user.active = true; // Change account status to Activated
    // Mongoose Method to save user into the database
    user.save();
    // console.log(user);
  });
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  res.send(user);
});

module.exports = router;
