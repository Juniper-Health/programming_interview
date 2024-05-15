-- Dump of the schema for the database.db file
CREATE TABLE `actors` (
  `id` int(11) NOT NULL DEFAULT 0,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL, 
  `name` varchar(255), 
  `bacon_number` int,
  PRIMARY KEY (`id`)
);
CREATE TABLE `movies` (
  `id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(100) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `rank` float DEFAULT NULL,
  PRIMARY KEY (`id`)
);
CREATE TABLE `roles` (
  `actor_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `role` varchar(100) NOT NULL,
  PRIMARY KEY (`actor_id`,`movie_id`,`role`),
  CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`actor_id`) REFERENCES `actors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `roles_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
