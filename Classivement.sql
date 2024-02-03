-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 03 fév. 2024 à 14:23
-- Version du serveur : 8.0.27
-- Version de PHP : 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `classivement`
--

-- --------------------------------------------------------

--
-- Structure de la table `achievement`
--

DROP TABLE IF EXISTS `achievement`;
CREATE TABLE IF NOT EXISTS `achievement` (
  `id_Achievement` int NOT NULL AUTO_INCREMENT,
  `id_Users` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `jeu_id` int NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `icon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_Achievement`),
  KEY `fk_user_achievement` (`id_Users`),
  KEY `fk_jeu_achievement` (`jeu_id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `achievement`
--

INSERT INTO `achievement` (`id_Achievement`, `id_Users`, `title`, `description`, `jeu_id`, `date_creation`, `icon`) VALUES
(1, 1, 'On ne fuis pas son destin !', 'Capturer un Celebi chromatique \r\n\r\n(1 / 8192 lors de la rencontre de Celebi)\r\n', 14, '2024-01-22 13:12:58', '1705929177886-Celebi.png'),
(2, 1, 'Mirror of the World', 'Terminer le mode Arcade avec Sol Badguy ou Ky Kiske sans continue et battre Baiken\r\n', 24, '2024-01-22 13:16:04', '1705929363931-Baiken.png'),
(3, 1, 'Fin de la triche', 'Battre une GT40 sur le circuit de Rome lors de la course des voitures populaires avec une voiture en dessous de la limite des 295 ch', 37, '2024-01-22 13:20:24', '1705929623943-GT40.webp'),
(4, 1, 'INVINCIBLE !', 'Terminer Facility en 00 Agent en moins de 2 minutes et 5 secondes ', 19, '2024-01-22 13:22:58', '1705929777876-Boris.png'),
(5, 1, '3 Hearts Challenge', 'Terminer le jeu avec seuleument 3 Cœurs\r\n(Quart de cœurs et Réceptacle de Cœur interdits)', 9, '2024-01-22 13:27:06', '1705930025954-Heart-icons-02 (1).png'),
(6, 1, '3 Hearts Challenge', 'Terminer le jeu avec seuleument 3 Cœurs\r\n(Quart de cœurs et Réceptacle de Cœur interdits)', 17, '2024-01-22 13:27:09', '1705930028593-Heart-icons-02 (1).png'),
(7, 1, '3 Hearts Challenge', 'Terminer le jeu avec seuleument 3 Cœurs\r\n(Quart de cœurs et Réceptacle de Cœur interdits)', 18, '2024-01-22 13:27:11', '1705930031145-Heart-icons-02 (1).png'),
(8, 1, 'Flèche de Feu', 'Obtenir la flèche de Feu', 17, '2024-01-22 13:28:50', '1705930130042-OoT_Fire_Arrow_Render.webp'),
(9, 1, 'Flèche de Glace', 'Obtenir la flèche de Glace', 17, '2024-01-22 13:28:59', '1705930138826-OoT_Ice_Arrow_Render.webp'),
(10, 1, 'TEST', 'C\'est un Test', 44, '2024-01-23 08:15:24', '1705997723850-DVA.png'),
(11, 1, 'My name is Bond, James Bond', 'Finish all the missions in 00 Agent', 19, '2024-01-25 12:49:59', '1706186999192-James_Bond_N64.webp'),
(12, 1, '120 stars', 'Obtain all the stars in the game', 21, '2024-02-01 14:17:55', '1706797074532-star.webp');

-- --------------------------------------------------------

--
-- Structure de la table `commentaires`
--

DROP TABLE IF EXISTS `commentaires`;
CREATE TABLE IF NOT EXISTS `commentaires` (
  `id_commentaires` int NOT NULL AUTO_INCREMENT,
  `id_Users` int NOT NULL,
  `commentaires` text NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_Achievement` int NOT NULL,
  PRIMARY KEY (`id_commentaires`),
  KEY `fk_user_commentaires` (`id_Users`),
  KEY `fk_achievement_commentaires` (`id_Achievement`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `commentaires`
--

INSERT INTO `commentaires` (`id_commentaires`, `id_Users`, `commentaires`, `date_creation`, `id_Achievement`) VALUES
(19, 1, 'Ce commentaire est un test pour montrer que la section commentaire marche', '2024-02-03 14:19:13', 6),
(20, 2, 'Exactement\nEt là je répond au commentaire de Maxime pour montrer que la section commentaire marche', '2024-02-03 14:20:27', 6);

-- --------------------------------------------------------

--
-- Structure de la table `genre`
--

DROP TABLE IF EXISTS `genre`;
CREATE TABLE IF NOT EXISTS `genre` (
  `genre_id` int NOT NULL AUTO_INCREMENT,
  `nom_genre` varchar(255) NOT NULL,
  PRIMARY KEY (`genre_id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `genre`
--

INSERT INTO `genre` (`genre_id`, `nom_genre`) VALUES
(1, 'Jeux de combat'),
(2, 'Beat\'em all'),
(3, 'Jeux de plate-forme'),
(4, 'FPS'),
(5, 'Shoot\'em up'),
(6, 'Rail Shooters'),
(7, 'Action-RPG'),
(8, 'RPG'),
(9, 'Puzzle game'),
(10, 'Simulation'),
(11, 'Stratégie'),
(12, 'Jeux de sport'),
(13, 'Jeux de courses');

-- --------------------------------------------------------

--
-- Structure de la table `jeu`
--

DROP TABLE IF EXISTS `jeu`;
CREATE TABLE IF NOT EXISTS `jeu` (
  `jeu_id` int NOT NULL AUTO_INCREMENT,
  `nom_jeu` varchar(255) NOT NULL,
  `developpeur` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `editeur` varchar(255) NOT NULL,
  `plateforme_id` int NOT NULL,
  `genre_id` int DEFAULT NULL,
  `annee_sortie` int DEFAULT NULL,
  `couverture` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `score_popularite` int DEFAULT '0',
  PRIMARY KEY (`jeu_id`),
  KEY `genre_id` (`genre_id`),
  KEY `plateforme_id` (`plateforme_id`)
) ENGINE=MyISAM AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `jeu`
--

INSERT INTO `jeu` (`jeu_id`, `nom_jeu`, `developpeur`, `editeur`, `plateforme_id`, `genre_id`, `annee_sortie`, `couverture`, `score_popularite`) VALUES
(1, 'Kirby\'s Adventure', 'HAL Laboratory', 'Nintendo', 2, 3, 1993, 'kirby.png', 81),
(2, 'Kirby\'s Dream Land', 'HAL Laboratory', 'Nintendo', 3, 3, 1992, 'kirbygb.png', 78),
(3, 'Ninja Gaiden', 'Tecmo', 'Tecmo', 2, 3, 1991, 'ninjagaiden.png', 74),
(4, 'Super Mario Bros', 'Nintendo', 'Nintendo', 2, 3, 1985, 'mario.png', 84),
(5, 'Sonic the Hedgehog', 'Sonic Team', 'Sega', 5, 3, 1991, 'sonic.png', 82),
(6, 'Sonic the Hedgehog 2', 'Sonic Team', 'Sega', 5, 3, 1992, 'sonic2.png', 87),
(7, 'Alex Kidd in Miracle World', 'Sega', 'Sega', 1, 3, 1987, 'alexkidd.png', 66),
(8, 'Star Fox', 'Nintendo', 'Nintendo', 6, 6, 1993, 'starfox.png', 83),
(9, 'The Legend of Zelda: A Link to the Past', 'Nintendo', 'Nintendo', 6, 7, 1992, 'zelda3.png', 93),
(10, 'Metroid', 'Nintendo', 'Nintendo', 2, 7, 1986, 'metroid.png', 71),
(11, 'Street Fighter 2', 'Capcom', 'Capcom', 6, 1, 1992, 'sf2.png', 83),
(12, 'Mortal Kombat', 'Midway Games', 'Acclaim Entertainment', 5, 1, 1993, 'mk.png', 68),
(13, 'Pokémon Jaune', 'Game Freak', 'Nintendo', 4, 8, 2000, 'jaune.png', 83),
(14, 'Pokémon Cristal', 'Game Freak', 'Nintendo', 4, 8, 2001, 'cristal.png', 89),
(15, 'Fatal Fury', 'SNK', 'SNK', 7, 1, 1991, 'fatalfury.png', 63),
(16, 'Sega Rally Championship', 'Sega', 'Sega', 8, 13, 1996, 'segarally.png', 73),
(17, 'The Legend of Zelda: Ocarina of Time', 'Nintendo', 'Nintendo', 9, 7, 1998, 'zeldaoot.png', 92),
(18, 'The Legend of Zelda: Majora\'s Mask', 'Nintendo', 'Nintendo', 9, 7, 2000, 'zeldamm.png', 87),
(19, 'GoldenEye 007', 'Rare', 'Nintendo', 9, 4, 1997, 'goldeneye.png', 86),
(20, 'Perfect Dark', 'Rare', 'Nintendo', 9, 4, 2000, 'perfectdark.png', 90),
(21, 'Super Mario 64', 'Nintendo', 'Nintendo', 9, 3, 1996, 'mario64.png', 90),
(22, 'Crash Bandicoot', 'Naughty Dog', 'Sony', 10, 3, 1996, 'crash.png', 81),
(23, 'Tekken 3', 'Namco', 'Sony', 10, 1, 1998, 'tekken.png', 85),
(24, 'Guilty Gear', 'Arc System Works', 'Studio 3', 10, 1, 2000, 'guiltygear.png', 79),
(25, 'Grand Theft Auto 2', 'DMA Design', 'Rockstar Games', 10, 7, 1999, 'gta2.png', 73),
(26, 'Streets of Rage', 'Sega', 'Sega', 5, 2, 1991, 'sor.png', 77),
(27, 'Gradius', 'Konami', 'Konami', 2, 5, 1985, 'gradius.png', 68),
(28, 'Metal Gear Solid', 'Konami', 'Konami', 10, 7, 1999, 'mgs.png', 91),
(29, 'Resident Evil', 'Capcom', 'Capcom', 10, 7, 1996, 'residentevil.png', 77),
(30, 'Final Fantasy 7', 'Square', 'Square', 10, 8, 1997, 'ff7.png', 90),
(31, 'Puyo Puyo', 'Compile', 'Compile', 5, 9, 1991, 'puyo.png', 65),
(32, 'SimCity', 'Nintendo', 'Nintendo', 6, 10, 1992, 'simcity.png', 85),
(33, 'Les Sims', 'Maxis', 'Electronic Arts', 11, 10, 2000, 'sims.png', 80),
(34, 'Worms Armageddon', 'Team17', 'MicroProse', 11, 11, 1999, 'worms.png', 82),
(35, 'International Superstar Soccer 64', 'Konami', 'Konami', 9, 12, 1997, 'iss.png', 77),
(36, 'Gran Turismo', 'Polyphony Digital', 'Sony', 10, 13, 1998, 'gt1.png', 82),
(37, 'Gran Turismo 2', 'Polyphony Digital', 'Sony', 10, 13, 2000, 'gt2.png', 81),
(38, 'Aladdin', 'Virgin Interactive', 'Virgin Interactive', 5, 3, 1993, 'aladdin.png', 82),
(39, 'Tomb Raider', 'Core Design', 'Eidos Interactive', 10, 7, 1996, 'tombraider.png', 81),
(40, 'Dungeon Keeper', 'Bullfrog Productions', 'Electronic Arts', 11, 11, 1997, 'dungeon.png', 86),
(41, 'Doom', 'id Software', 'id Software', 11, 4, 1993, 'doom.png', 85),
(42, 'Quake', 'id Software', 'GT Interactive', 11, 4, 1996, 'quake.png', 82),
(43, 'Unreal Tournament', 'Epic Games', 'GT Interactive', 11, 4, 1999, 'unreal.png', 85),
(44, 'Half-Life', 'Valve Corporation', 'Sierra', 11, 4, 1998, 'hl.png', 89);

-- --------------------------------------------------------

--
-- Structure de la table `plateforme`
--

DROP TABLE IF EXISTS `plateforme`;
CREATE TABLE IF NOT EXISTS `plateforme` (
  `plateforme_id` int NOT NULL AUTO_INCREMENT,
  `nom_plateforme` varchar(255) NOT NULL,
  PRIMARY KEY (`plateforme_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `plateforme`
--

INSERT INTO `plateforme` (`plateforme_id`, `nom_plateforme`) VALUES
(1, 'Master System'),
(2, 'NES'),
(3, 'Gameboy'),
(4, 'Gameboy Color'),
(5, 'Mega Drive'),
(6, 'Super NES'),
(7, 'Neogeo'),
(8, 'Saturn'),
(9, 'Nintendo 64'),
(10, 'Playstation'),
(11, 'PC');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id_Users` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `jeu_id` int DEFAULT NULL,
  `admin` binary(1) NOT NULL DEFAULT '0',
  `ban` binary(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_Users`),
  KEY `jeu_id` (`jeu_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id_Users`, `username`, `email`, `password`, `avatar`, `jeu_id`, `admin`, `ban`) VALUES
(1, 'Maxime_115', 'leclercqmaximedu62@gmail.com', '$2b$10$8oNZjhlN7h5uy9uF33zKU.zEhtmSCLohj5NTm733z166632gdZ5QS', '1706017264967-Celebi.png', 17, 0x31, 0x30),
(2, 'Millia_Rage', 'MilliaRage@GuiltyGear.com', '$2b$10$PMuPcGbISndLnGrouQn0M.XkCmgR25.6GOQso8JkBKIotOiQrHbXa', '1706017317832-Millia.webp', 24, 0x30, 0x30),
(3, 'Maxime_935', 'leclairmaxime77@gmail.com', '$2b$10$ED2G7yK4HGTkBhgrUIXqsOvnTPtwzKRSJzwiImQevbtfPgumT1CrC', '1706796896906-Boris.png', NULL, 0x30, 0x30);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
