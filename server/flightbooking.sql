-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: localhost    Database: flightbooking
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `adminID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`adminID`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'gvanceAdmin','password');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aircraft`
--

DROP TABLE IF EXISTS `aircraft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aircraft` (
  `aircraftID` int NOT NULL AUTO_INCREMENT,
  `number_of_seats` int DEFAULT NULL,
  `model_number` varchar(255) DEFAULT NULL,
  `weight_limit` int DEFAULT NULL,
  `owned_by` varchar(255) NOT NULL,
  PRIMARY KEY (`aircraftID`),
  KEY `owned_by_idx` (`owned_by`),
  CONSTRAINT `owned_by` FOREIGN KEY (`owned_by`) REFERENCES `airline` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aircraft`
--

LOCK TABLES `aircraft` WRITE;
/*!40000 ALTER TABLE `aircraft` DISABLE KEYS */;
INSERT INTO `aircraft` VALUES (1,280,'787-9',193000,'WestJet'),(2,78,'Dash 8-400',28123,'WestJet'),(3,140,'A320-200',145504,'Air Canada'),(4,78,'Dash 8-400',28123,'Air Canada'),(5,280,'787-9',193000,'Air Canada'),(6,140,'A320-200',145504,'American Airlines'),(7,78,'Dash 8-400',28123,'American Airlines'),(8,280,'787-9',193000,'American Airlines'),(9,140,'A320-200',145504,'British Airways'),(10,280,'787-9',193000,'British Airways'),(11,410,'747-8',312072,'Thai Airways'),(12,555,'A380-800',386000,'Thai Airways'),(13,140,'A320-200',145504,'South African Airways'),(14,78,'Dash 8-400',28123,'South African Airways'),(15,280,'787-9',193000,'South African Airways');
/*!40000 ALTER TABLE `aircraft` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airline`
--

DROP TABLE IF EXISTS `airline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airline` (
  `name` varchar(255) NOT NULL,
  `home_office` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `hq_airport` varchar(255) NOT NULL,
  PRIMARY KEY (`name`),
  KEY `hq_airport_idx` (`hq_airport`),
  CONSTRAINT `hq_airport` FOREIGN KEY (`hq_airport`) REFERENCES `airport` (`airportCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airline`
--

LOCK TABLES `airline` WRITE;
/*!40000 ALTER TABLE `airline` DISABLE KEYS */;
INSERT INTO `airline` VALUES ('Air Canada','Air Canada Centre 7373 Cote Vertu Boulevard We Saint-Laurent\nDORVAL, QC H4S 1Z3 Canada','1-514-422-5000','YYZ'),('American Airlines','4333 Amon Carter Blvd.\nFort Worth, Texas 76155 USA','1-817-963-1234','JFK'),('British Airways','Waterside HBA3 or PO Box 365\nHarmondsworth, UB7 0GB UK','+44-20-87385117','LHR'),('South African Airways','Airways Park, 32 Jones Road, Kempton Park, Johannesburg, South Africa','+27 11 978 1000','CPT'),('Thai Airways','89 Vibhavadi Rangsit Road\nBangkok 10900, Thailand','(66) 2545-1000','BKK'),('WestJet','22 Aerial Place NE\nCALGARY, AB T2E 3J1 Canada','1-403-444-2600','YYC');
/*!40000 ALTER TABLE `airline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airlineRatings`
--

DROP TABLE IF EXISTS `airlineRatings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airlineRatings` (
  `airline_name` varchar(255) NOT NULL,
  `rating` int NOT NULL,
  KEY `airline_name_idx` (`airline_name`),
  CONSTRAINT `airline_name` FOREIGN KEY (`airline_name`) REFERENCES `airline` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airlineRatings`
--

LOCK TABLES `airlineRatings` WRITE;
/*!40000 ALTER TABLE `airlineRatings` DISABLE KEYS */;
INSERT INTO `airlineRatings` VALUES ('Air Canada',3),('Air Canada',2),('Air Canada',3),('Air Canada',4),('Air Canada',2),('Air Canada',2),('Air Canada',5),('Air Canada',1),('Air Canada',1),('Air Canada',4),('Air Canada',5),('Air Canada',5),('Air Canada',4),('Air Canada',4),('Air Canada',4),('Air Canada',4),('Air Canada',3),('Air Canada',3),('Air Canada',5),('Air Canada',5),('Air Canada',5),('Air Canada',5),('Air Canada',5),('Air Canada',5);
/*!40000 ALTER TABLE `airlineRatings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airport`
--

DROP TABLE IF EXISTS `airport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airport` (
  `airportCode` varchar(255) NOT NULL,
  `number_of_gates` int DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`airportCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airport`
--

LOCK TABLES `airport` WRITE;
/*!40000 ALTER TABLE `airport` DISABLE KEYS */;
INSERT INTO `airport` VALUES ('ACC',110,'Ghana','Accra'),('BKK',133,'Thailand','Bangkok'),('CAI',112,'Egypt','Cairo'),('CDG',125,'France','Paris'),('CPT',115,'South Africa','Cape Town'),('FCO',124,'Italy','Rome'),('ICN',135,'South Korea','Seoul'),('JFK',128,'USA','New York City'),('LAX',130,'USA','Los Angeles'),('LHR',132,'UK','London'),('NRT',136,'Japan','Tokyo'),('YEG',90,'Canada','Edmonton'),('YHZ',80,'Canada','Halifax'),('YOW',90,'Canada','Ottawa'),('YQR',70,'Canada','Regina'),('YUL',112,'Canada','Montreal'),('YVR',110,'Canada','Vancouver'),('YWG',65,'Canada','Winnepeg'),('YYC',103,'Canada','Calgary'),('YYZ',125,'Canada','Toronto');
/*!40000 ALTER TABLE `airport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight`
--

DROP TABLE IF EXISTS `flight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flight` (
  `flightnumID` int NOT NULL AUTO_INCREMENT,
  `flightNumber` varchar(255) NOT NULL,
  `departure_date` date NOT NULL,
  `departure_time` time NOT NULL,
  `arrival_date` date DEFAULT NULL,
  `arrival_time` time DEFAULT NULL,
  `airline` varchar(255) NOT NULL,
  `route` varchar(255) NOT NULL,
  `aircraft` int NOT NULL,
  PRIMARY KEY (`flightnumID`,`flightNumber`,`departure_date`),
  KEY `airline_idx` (`airline`),
  KEY `route_idx` (`route`),
  KEY `aircraft_idx` (`aircraft`),
  CONSTRAINT `aircraft` FOREIGN KEY (`aircraft`) REFERENCES `aircraft` (`aircraftID`),
  CONSTRAINT `airline` FOREIGN KEY (`airline`) REFERENCES `airline` (`name`),
  CONSTRAINT `route` FOREIGN KEY (`route`) REFERENCES `route` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight`
--

LOCK TABLES `flight` WRITE;
/*!40000 ALTER TABLE `flight` DISABLE KEYS */;
INSERT INTO `flight` VALUES (1,'AC10','2022-05-25','15:00:00','2022-05-25','16:00:00','Air Canada','YYC-YEG',4),(2,'WJ210','2022-05-26','09:00:00','2022-05-26','10:00:00','WestJet','YEG-YYC',1),(3,'WJ220','2022-05-25','09:00:00','2022-05-25','10:10:00','WestJet','YYC-YEG',2),(4,'AA310','2022-05-16','23:15:00','2022-05-17','01:45:00','American Airlines','YYC-LAX',6);
/*!40000 ALTER TABLE `flight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `frequentFlier`
--

DROP TABLE IF EXISTS `frequentFlier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `frequentFlier` (
  `customerID` int NOT NULL,
  `airline` varchar(255) NOT NULL,
  `tier` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`customerID`,`airline`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frequentFlier`
--

LOCK TABLES `frequentFlier` WRITE;
/*!40000 ALTER TABLE `frequentFlier` DISABLE KEYS */;
INSERT INTO `frequentFlier` VALUES (1,'Air Canada','Gold'),(1,'WestJet','Silver');
/*!40000 ALTER TABLE `frequentFlier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `reservation_number` int NOT NULL AUTO_INCREMENT,
  `flightNumber` int NOT NULL,
  `customerID` int NOT NULL,
  `seat_number` varchar(255) DEFAULT NULL,
  `luggage` int DEFAULT NULL,
  PRIMARY KEY (`reservation_number`),
  KEY `flightNumber_idx` (`flightNumber`),
  KEY `customerID_idx` (`customerID`),
  CONSTRAINT `customerID` FOREIGN KEY (`customerID`) REFERENCES `users` (`userID`),
  CONSTRAINT `flightnumber` FOREIGN KEY (`flightNumber`) REFERENCES `flight` (`flightnumID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (1,1,1,'B10',1),(2,2,1,'B10',NULL),(3,4,1,'A15',2),(4,4,2,'A16',4);
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restrictions`
--

DROP TABLE IF EXISTS `restrictions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restrictions` (
  `type` varchar(255) NOT NULL,
  `severity` int DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restrictions`
--

LOCK TABLES `restrictions` WRITE;
/*!40000 ALTER TABLE `restrictions` DISABLE KEYS */;
INSERT INTO `restrictions` VALUES ('COVIDTest',3,'Pandemic Restriction: Must have recent negative COVID test'),('Passport',5,'International Travel: Must have valid passport'),('USAirspace',4,'Background Check: Flying through USA airspace, must be chacked against US No-Fly List'),('Vaccination',5,'Health Restriction: Must have current relevant vaccinations for travel');
/*!40000 ALTER TABLE `restrictions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route`
--

DROP TABLE IF EXISTS `route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route` (
  `name` varchar(255) NOT NULL,
  `origin` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `restriction` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`name`),
  KEY `restriction_idx` (`restriction`),
  KEY `origin_idx` (`origin`),
  KEY `destination_idx` (`destination`),
  CONSTRAINT `destination` FOREIGN KEY (`destination`) REFERENCES `airport` (`airportCode`),
  CONSTRAINT `origin` FOREIGN KEY (`origin`) REFERENCES `airport` (`airportCode`),
  CONSTRAINT `restriction` FOREIGN KEY (`restriction`) REFERENCES `restrictions` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route`
--

LOCK TABLES `route` WRITE;
/*!40000 ALTER TABLE `route` DISABLE KEYS */;
INSERT INTO `route` VALUES ('LAX-YYC','LAX','YYC','Passport'),('YEG-YYC','YEG','YYC',NULL),('YYC-LAX','YYC','LAX','Passport'),('YYC-YEG','YYC','YEG',NULL),('YYC-YYZ','YYC','YYZ',NULL),('YYZ-YYC','YYZ','YYC',NULL);
/*!40000 ALTER TABLE `route` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `creditcardnumber` varchar(255) NOT NULL,
  `creditcardExpiry` varchar(255) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'gvance','Greg Vance','password','4520123456781120','03/24'),(2,'cPom','Christopher Pomerleau','Pa$$w0rd2','7894561236985214','05/28');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-12 23:44:40
