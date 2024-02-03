const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const jsonwebtoken = require("jsonwebtoken");
// const key = require("./keys");
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

const uploadCover = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "/cover"));
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
app.use(express.static(path.join(__dirname, "cover"))); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE",
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 *24,
    httpOnly: true
  }
}));


require("./database");

app.use((req, res, next) => {

  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");

  

  next();
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sqlVerifyMail = "SELECT id_Users, password, username, admin, ban FROM users WHERE email=?";
  connection.query(sqlVerifyMail, [email], async (err, result) => {
    if (err) throw err;
    let isEmail;
    if (result.length === 0) {
      isEmail = { message: "Email et/ou mot de passe incorrects !" };
    } else {
      const dbPassword = result[0].password;
      const passwordMatch = await bcrypt.compare(password, dbPassword);
      if (passwordMatch) {
        req.session.username = result[0].username;
        req.session.id_Users = result[0].id_Users;
        req.session.admin = result[0].admin;
        req.session.ban = result[0].ban;
        console.log(req.session.username);
      
        isEmail = {
          messageGood: "Connexion réussie ! Vous allez être redirigé(e)",
          id: result[0].id,
        };
        return res.json({ Login: true, username: req.session.username });
      } else {
        isEmail = { message: "Email et/ou mot de passe incorrects !" };
        return res.json({ Login: false });
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

app.post("/logout", (req, res) => {
  req.session.destroy(function(err) {
    if(err){
      console.log(err);
      res.status(500).json({ error: 'Failed to logout.' });
    }
    // will clear the session if it exists, and does nothing if it doesn’t.
    res.clearCookie('connect.sid'); // replace with the name of the cookie storing your session id
    res.status(200).json({ message: 'Logged out.' });
  });
});

app.post("/addAchievement", upload.single("icon"), async (req, res) => {
  let iconPath;
  if (req.file === undefined) {
    iconPath = null;
  } else {
    iconPath = req.file.filename;
  }

  const { title, description, game, userId } = req.body;
  const dateCreation = new Date(); // Use the current date and time

  const sqlInsert =
    "INSERT INTO achievement (id_Users, title, description, jeu_id, date_creation, icon) VALUES (?, ?, ?, ?, ?, ?)";

  connection.query(
    sqlInsert,
    [userId, title, description, game, dateCreation, iconPath],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur d'ajout de l'achievement" });
      } else {
        res.status(200).json({ message: "Achievement ajouté avec succès" });
      }
    }
  );
});

app.get("/getComments/:achievementId", (req, res) => {
  const { achievementId } = req.params;

  const sql = `
    SELECT
      commentaires.*,
      users.username,
      users.avatar
    FROM
      commentaires
    JOIN users ON commentaires.id_users = users.id_Users
    WHERE
      commentaires.id_achievement = ?;
  `;

  connection.query(sql, [achievementId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur fetch" });
    } else {
      console.log("Liste de commentaires récupérée");
      res.send(JSON.stringify(result));
    }
  });
});


app.post("/postComment/:achievementId/:id_Users", (req, res) => {
  const { id_Users, achievementId } = req.params;
  const { comment } = req.body;

  console.log(`Received comment: ${comment}`);

  const dateCreation = new Date(); // Use the current date and time

  const sqlInsert =
    "INSERT INTO commentaires (id_Users, commentaires, date_creation, id_Achievement) VALUES (?, ?, ?, ?)";

  connection.query(
    sqlInsert,
    [id_Users, comment, dateCreation, achievementId],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur d'ajout du commentaire" });
      } else {
        res.status(200).json({ message: "Commentaire ajouté avec succès" });
      }
    }
  );
});

app.delete("/deleteComment/:commentId", (req, res) => {
  const { commentId } = req.params;

  const deleteCommentQuery = "DELETE FROM commentaires WHERE id_commentaires = ?";

  connection.query(deleteCommentQuery, [commentId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la suppression du commentaire" });
    } else {
      res.status(200).json({ message: "Commentaire supprimé avec succès" });
    }
  });
});






app.put("/updateProfile/:userId", upload.single("avatar"), async (req, res) => {
  const userId = req.params.userId;
  const { username, email, password, game } = req.body;
  console.log(req.file);



  // Get the current user data to determine the existing avatar file
  const getCurrentUserDataQuery = "SELECT avatar FROM users WHERE id_Users = ?";
  connection.query(getCurrentUserDataQuery, [userId], async (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    let avatar;
    if (req.file === undefined) {
      // If no new avatar file is provided, keep the existing avatar in the database
      avatar = result[0].avatar;
    } else {
      // If a new avatar file is provided, use the new file and delete the old one
      avatar = req.file.filename;

      // Delete the old avatar file
      const oldAvatarPath = path.join(__dirname, "/upload", result[0].avatar);
      fs.unlink(oldAvatarPath, (err) => {
        if (err) {
          console.log("Erreur suppression ancien fichier avatar");
        } else {
          console.log("Ancien fichier avatar supprimé");
        }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateProfileQuery = `
      UPDATE users
      SET username = ?, email = ?, password = ?, avatar = ?, jeu_id = ?
      WHERE id_Users = ?;
    `;

    connection.query(
      updateProfileQuery,
      [username, email, hashedPassword, avatar, game, userId],
      (updateError, updateResult) => {
        if (updateError) {
          console.error(updateError);
          res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
        } else {
          res.status(200).json({ message: "Profil mis à jour avec succès" });
        }
      }
    );
  });
});





// Update your backend to add the following endpoint
app.get("/getGames", (req, res) => {
  const sql = `
    SELECT
        jeu.jeu_id,
        jeu.nom_jeu,
        jeu.developpeur,
        jeu.editeur,
        plateforme.nom_plateforme AS plateforme,
        genre.nom_genre AS genre,
        jeu.annee_sortie,
        jeu.couverture,
        jeu.score_popularite
    FROM
        jeu
    JOIN plateforme ON jeu.plateforme_id = plateforme.plateforme_id
    JOIN genre ON jeu.genre_id = genre.genre_id;
  `;

  connection.query(sql, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur fetch" });
    } else {
      console.log("Liste de jeux récupérée");
      res.send(JSON.stringify(result));
    }
  });
});

app.get("/getGames/:gameId", (req, res) => {
  const gameId = req.params.gameId;

  const sql = `
    SELECT
        jeu.jeu_id,
        jeu.nom_jeu,
        jeu.developpeur,
        jeu.editeur,
        plateforme.nom_plateforme AS plateforme,
        genre.nom_genre AS genre,
        jeu.annee_sortie,
        jeu.couverture,
        jeu.score_popularite
    FROM
        jeu
    JOIN plateforme ON jeu.plateforme_id = plateforme.plateforme_id
    JOIN genre ON jeu.genre_id = genre.genre_id
    WHERE
        jeu.jeu_id = ?;
  `;

  connection.query(sql, [gameId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur fetch" });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "Jeu non trouvé" });
      } else {
        console.log("Jeu récupéré");
        res.send(JSON.stringify(result[0]));
      }
    }
  });
});



app.get("/getAchievement", (req, res) => {
  const sql = `
      SELECT
      achievement.*,
      users.username,
      jeu.nom_jeu AS game_name
    FROM
      achievement
    JOIN users ON achievement.id_users = users.id_users
    JOIN jeu ON achievement.jeu_id = jeu.jeu_id;
    `;

  connection.query(sql, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur fetch" });
    } else {
      console.log("Liste achievements récupérée");
      res.send(JSON.stringify(result));
    }
  });
});

app.get("/getAchievement/:achievementId", (req, res) => {
  const { achievementId } = req.params;
  
  const sql = `
    SELECT
      achievement.*,
      users.username,
      jeu.nom_jeu AS game_name
    FROM
      achievement
    JOIN users ON achievement.id_users = users.id_users
    JOIN jeu ON achievement.jeu_id = jeu.jeu_id
    WHERE
      achievement.id_Achievement = ?;
  `;

  connection.query(sql, [achievementId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur fetch" });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "Achievement non trouvé" });
      } else {
        console.log("Achievement récupéré");
        res.send(JSON.stringify(result[0])); // Assuming you only expect one achievement with the given ID
      }
    }
  });
});

app.get("/getUser", (req, res) => {
  if(req.session.username) {
    console.log(req.session.username);
    console.log(req.session.id_Users);
    console.log(req.session.admin);
    console.log(req.session.ban);
    return res.json({ valid: true, username: req.session.username, id_Users: req.session.id_Users, admin: req.session.admin, ban: req.session.ban });
  } else {
    console.log("Aucun utilisateur connecté");
    return res.json({ valid: false });
  }
})

app.get("/getUserProfile/:userId", (req, res) => {
  
  if (!req.session.username) {
    res.status(401).json({ message: "Unauthorized access" });
    return;
  }

  const userId = req.params.userId;
  const sql = "SELECT * FROM users WHERE id_Users = ?";
  connection.query(sql, [userId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur fetch" });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "Utilisateur non trouvé" });
      } else {
        console.log("Profil de l'utilisateur récupéré");
        res.send(JSON.stringify(result[0]));
      }
    }
  });
});


// Add this endpoint in your Express server
app.get('/refreshSession', (req, res) => {
  if (req.session.username) {
    // Session still valid, refresh the session by resetting the cookie maxAge
    req.session.cookie.maxAge = 1000 * 60 * 60 * 24; // Set the maxAge to the desired session duration
    res.status(200).json({ message: 'Session refreshed' });
  } else {
    // Session expired, send a response indicating the user is not logged in
    res.status(401).json({ message: 'Session expired' });
  }
});

app.listen(port, () => {
  console.log(`Serveur Node écoutant sur le port${port}`);
});