CREATE DATABASE  IF NOT EXISTS `library_management_system`;
USE `library_management_system`;

DROP TABLE IF EXISTS `books`;

CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `ISBN` varchar(13) NOT NULL,
  `quantity` int NOT NULL,
  `shelf_location` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ISBN` (`ISBN`),
  KEY `idx_books_title` (`title`),
  KEY `idx_books_author` (`author`),
  KEY `idx_books_isbn` (`ISBN`)
);


LOCK TABLES `books` WRITE;

INSERT INTO `books` VALUES (1,'To Kill a Mockingbird','Harper Lee','9780061120084',5,'A1'),(2,'1984','George Orwell','9780451524935',4,'B2'),(3,'The Great Gatsby','F. Scott Fitzgerald','9780743273565',6,'C3'),(4,'One Hundred Years of Solitude','Gabriel García Márquez','9780060883287',3,'D4'),(5,'A Brief History of Time','Stephen Hawking','9780553380163',4,'E5'),(6,'The Catcher in the Rye','J.D. Salinger','9780316769488',5,'F6'),(7,'The Alchemist','Paulo Coelho','9780062315007',6,'G7'),(8,'Pride and Prejudice','Jane Austen','9780679783268',4,'H8'),(9,'Animal Farm','George Orwell','9780451526342',5,'I9'),(10,'Harry Potter and the Sorcerer’s Stone','J.K. Rowling','9780590353427',7,'J10'),(12,'Meeee','George Orwellyy','9780451524751',5,'A2'),(14,'Memmmsss','Memms','9780451524124',3,'A3');

UNLOCK TABLES;

DROP TABLE IF EXISTS `borrowers`;

CREATE TABLE `borrowers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `registered_date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_borrowers_name` (`name`),
  KEY `idx_borrowers_email` (`email`)
);

LOCK TABLES `borrowers` WRITE;
INSERT INTO `borrowers` VALUES (1,'John Doe','john.doe@example.com','2022-01-10'),(2,'Jane Smith','jane.smith@example.com','2022-02-15'),(3,'Emily Johnson','emily.johnson@example.com','2022-03-20'),(4,'Michael Brown','michael.brown@example.com','2022-04-25'),(5,'Sarah Davis','sarah.davis@example.com','2022-05-30'),(6,'William Wilson','william.wilson@example.com','2022-06-04'),(7,'Jessica Garcia','jessica.garcia@example.com','2022-07-09'),(8,'David Miller','david.miller@example.com','2022-08-14'),(9,'Sophia Martinez','sophia.martinez@example.com','2022-09-19'),(10,'James Hernandez','james.hernandez@example.com','2022-10-24');
UNLOCK TABLES;

DROP TABLE IF EXISTS `borrowings`;

CREATE TABLE `borrowings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `borrower_id` int NOT NULL,
  `checkout_date` date NOT NULL,
  `due_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_borrowings_book_id` (`book_id`),
  KEY `idx_borrowings_borrower_id` (`borrower_id`),
  CONSTRAINT `borrowings_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `borrowings_ibfk_2` FOREIGN KEY (`borrower_id`) REFERENCES `borrowers` (`id`)
);

LOCK TABLES `borrowings` WRITE;

INSERT INTO `borrowings` VALUES (1,1,10,'2022-11-01','2022-11-15','2024-01-20'),(2,2,9,'2022-11-03','2022-11-17',NULL),(3,3,8,'2022-11-05','2022-11-19',NULL),(4,4,7,'2022-11-07','2022-11-21',NULL),(5,5,6,'2022-11-09','2022-11-23',NULL),(6,6,5,'2022-11-11','2022-11-25',NULL),(7,7,4,'2022-11-13','2022-11-27',NULL),(8,8,3,'2022-11-15','2022-11-29',NULL),(9,9,2,'2022-11-17','2022-12-01',NULL),(10,10,1,'2022-11-19','2022-12-03',NULL),(11,1,1,'2024-01-12','2024-02-12',NULL),(12,1,1,'2024-01-12','2024-02-12',NULL);

UNLOCK TABLES;

