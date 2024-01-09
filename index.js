const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const connection = require("./database");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "/upload"));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    console.log(file);
    cb(null, true);
  },
});

const port = 8000;

const app = express();
app.use(express.static(path.join(__dirname, "upload")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./database");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sqlVerifyMail = "Select id_Users, password FROM users WHERE email=?";
  connection.query(sqlVerifyMail, [email], async (err, result) => {
    if (err) throw err;
    let isEmail;
    if (result.length === 0) {
      isEmail = { message: "Email et/ou mot de passe incorrects !" };
    } else {
      const dbPassword = result[0].password;
      const passwordMatch = await bcrypt.compare(password, dbPassword);
      if (passwordMatch) {
        isEmail = {
          messageGood: "Connexion réussie ! Vous allez être redirigé(e)",
          id: result[0].id,
        };
      } else {
        isEmail = { message: "Email et/ou mot de passe incorrects !" };
      }
    }
    res.status(200).json(isEmail);
  });
});

app.post("/register", upload.single("avatar"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  let avatar;
  if (req.file === undefined) {
    avatar = null;
  } else {
    avatar = req.file.filename;
  }
  const { username, email, password } = req.body;
  const sqlVerify = "SELECT * FROM users WHERE email= ?";
  const hashedPassword = await bcrypt.hash(password, 10);
  connection.query(sqlVerify, [email], (err, result) => {
    if (err) throw err;
    if (result.length) {
      let isEmail = { message: "Email existant" };
      if (avatar) {
        const filePath = path.join(__dirname, "/upload", avatar);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Erreur suppression fichier");
          }
          console.log("Fichier supprimé");
        });
      }
      res.status(200).json(isEmail);
    } else {
      const sqlInsert =
        "INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)";
      connection.query(
        sqlInsert,
        [username, email, hashedPassword, avatar],
        (err, result) => {
          if (err) throw err;
          let isEmail = {
            messageGood: "Inscription réussie ! Vous allez être redirigé(e)",
          };
          res.status(200).json(isEmail);
        }
      );
    }
  });
});

app.post("/addAchievement", upload.single("icon"), async (req, res) => {
  let iconPath;
  if (req.file === undefined) {
    iconPath = null;
  } else {
    iconPath = req.file.filename;
  }

  const { title, description, game } = req.body;
  const sqlInsert =
    "INSERT INTO achievement (title, description, game, icon) VALUES (?, ?, ?, ?)";
  connection.query(
    sqlInsert,
    [title, description, game, iconPath],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur d'ajout de l'achievement" });
      } else {
        res.status(200).json({ message: "Achievement ajouté avec succés" });
      }
    }
  );
});

app.get("/getAchievement", (req, res) => {
  const sql = 'SELECT * FROM achievement';
  connection.query(sql, (error, resulat) => {
      if (error){
          throw error
      } else {
          console.log("Liste achievements récupéré");
          res.send(JSON.stringify(resulat))
      }
  })
})

app.listen(port, () => {
  console.log(`Serveur Node écoutant sur le port${port}`);
});
