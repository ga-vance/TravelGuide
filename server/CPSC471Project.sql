CREATE DATABASE  IF NOT EXISTS `flightbooking`;
USE `flightbooking`;
-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: localhost    Database: flightbooking
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
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
CREATE TABLE `admin` (
  `adminIn` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`adminIn`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
INSERT INTO `admin` VALUES (1,'gvanceAdmin','password');
UNLOCK TABLES;

--
-- Table structure for table `aircraft`
--

DROP TABLE IF EXISTS `aircraft`;
CREATE TABLE `aircraft` (
  `aircraftID` int NOT NULL AUTO_INCREMENT,
  `number_of_seats` int DEFAULT NULL,
  `model_number` varchar(255) DEFAULT NULL,
  `weight_limit` int DEFAULT NULL,
  `owned_by` varchar(255) NOT NULL,
  PRIMARY KEY (`aircraftID`),
  KEY `owned_by_idx` (`owned_by`),
  CONSTRAINT `owned_by` FOREIGN KEY (`owned_by`) REFERENCES `airline` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16;

--
-- Dumping data for table `aircraft`
--

LOCK TABLES `aircraft` WRITE;
INSERT INTO `aircraft` VALUES (1,280,'787-9',193000,'WestJet'),(2,78,'Dash 8-400',28123,'WestJet'),(3,140,'A320-200',145504,'Air Canada'),(4,78,'Dash 8-400',28123,'Air Canada'),(5,280,'787-9',193000,'Air Canada'),(6,140,'A320-200',145504,'American Airlines'),(7,78,'Dash 8-400',28123,'American Airlines'),(8,280,'787-9',193000,'American Airlines'),(9,140,'A320-200',145504,'British Airways'),(10,280,'787-9',193000,'British Airways'),(11,410,'747-8',312072,'Thai Airways'),(12,555,'A380-800',386000,'Thai Airways'),(13,140,'A320-200',145504,'South African Airways'),(14,78,'Dash 8-400',28123,'South African Airways'),(15,280,'787-9',193000,'South African Airways');
UNLOCK TABLES;

--
-- Table structure for table `airline`
--

DROP TABLE IF EXISTS `airline`;
CREATE TABLE `airline` (
  `name` varchar(255) NOT NULL,
  `home_office` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `hq_airport` varchar(255) NOT NULL,
  PRIMARY KEY (`name`),
  KEY `hq_airport_idx` (`hq_airport`),
  CONSTRAINT `hq_airport` FOREIGN KEY (`hq_airport`) REFERENCES `airport` (`airportCode`)
) ENGINE=InnoDB;

--
-- Dumping data for table `airline`
--

LOCK TABLES `airline` WRITE;
INSERT INTO `airline` VALUES ('Air Canada','Air Canada Centre 7373 Cote Vertu Boulevard We Saint-Laurent\nDORVAL, QC H4S 1Z3 Canada','1-514-422-5000','YYZ'),('American Airlines','4333 Amon Carter Blvd.\nFort Worth, Texas 76155 USA','1-817-963-1234','JFK'),('British Airways','Waterside HBA3 or PO Box 365\nHarmondsworth, UB7 0GB UK','+44-20-87385117','LHR'),('South African Airways','Airways Park, 32 Jones Road, Kempton Park, Johannesburg, South Africa','+27 11 978 1000','CPT'),('Thai Airways','89 Vibhavadi Rangsit Road\nBangkok 10900, Thailand','(66) 2545-1000','BKK'),('WestJet','22 Aerial Place NE\nCALGARY, AB T2E 3J1 Canada','1-403-444-2600','YYC');
UNLOCK TABLES;

--
-- Table structure for table `airline_ratings`
--

DROP TABLE IF EXISTS `airline_ratings`;
CREATE TABLE `airline_ratings` (
  `airline_name` varchar(255) NOT NULL,
  `rating` int NOT NULL,
  KEY `airline_name_idx` (`airline_name`),
  CONSTRAINT `airline_name` FOREIGN KEY (`airline_name`) REFERENCES `airline` (`name`)
) ENGINE=InnoDB;

--
-- Dumping data for table `airline_ratings`
--

LOCK TABLES `airline_ratings` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `airport`
--

DROP TABLE IF EXISTS `airport`;
CREATE TABLE `airport` (
  `airportCode` varchar(255) NOT NULL,
  `number_of_gates` int DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`airportCode`)
) ENGINE=InnoDB;

--
-- Dumping data for table `airport`
--

LOCK TABLES `airport` WRITE;
INSERT INTO `airport` VALUES ('ACC',110,'Ghana','Accra'),('BKK',133,'Thailand','Bangkok'),('CAI',112,'Egypt','Cairo'),('CDG',125,'France','Paris'),('CPT',115,'South Africa','Cape Town'),('FCO',124,'Italy','Rome'),('ICN',135,'South Korea','Seoul'),('JFK',128,'USA','New York City'),('LAX',130,'USA','Los Angeles'),('LHR',132,'UK','London'),('NRT',136,'Japan','Tokyo'),('YEG',90,'Canada','Edmonton'),('YHZ',80,'Canada','Halifax'),('YOW',90,'Canada','Ottawa'),('YQR',70,'Canada','Regina'),('YUL',112,'Canada','Montreal'),('YVR',110,'Canada','Vancouver'),('YWG',65,'Canada','Winnepeg'),('YYC',103,'Canada','Calgary'),('YYZ',125,'Canada','Toronto');
UNLOCK TABLES;

--
-- Table structure for table `flight`
--

DROP TABLE IF EXISTS `flight`;
CREATE TABLE `flight` (
  `flightnumID` int NOT NULL AUTO_INCREMENT,
  `flightNumber` varchar(255) NOT NULL,
  `departure_datetime` datetime NOT NULL,
  `arrival_datetime` datetime DEFAULT NULL,
  `available_seats` int DEFAULT NULL,
  `airline` varchar(255) NOT NULL,
  `route` varchar(255) NOT NULL,
  `aircraft` int NOT NULL,
  PRIMARY KEY (`flightnumID`),
  KEY `airline_idx` (`airline`),
  KEY `route_idx` (`route`),
  KEY `aircraft_idx` (`aircraft`),
  CONSTRAINT `aircraft` FOREIGN KEY (`aircraft`) REFERENCES `aircraft` (`aircraftID`),
  CONSTRAINT `airline` FOREIGN KEY (`airline`) REFERENCES `airline` (`name`),
  CONSTRAINT `route` FOREIGN KEY (`route`) REFERENCES `route` (`name`)
) ENGINE=InnoDB;

--
-- Dumping data for table `flight`
--

LOCK TABLES `flight` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `frequentFlier`
--

DROP TABLE IF EXISTS `frequentFlier`;
CREATE TABLE `frequentFlier` (
  `customerID` int NOT NULL,
  `airline` varchar(255) NOT NULL,
  `tier` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`customerID`,`airline`)
) ENGINE=InnoDB;

--
-- Dumping data for table `frequentFlier`
--

LOCK TABLES `frequentFlier` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE `reservation` (
  `reservation_number` int NOT NULL,
  `sear_number` varchar(255) DEFAULT NULL,
  `luggage` int DEFAULT NULL,
  `customerID` int NOT NULL,
  `flightNumber` int NOT NULL,
  PRIMARY KEY (`reservation_number`),
  KEY `flightNumber_idx` (`flightNumber`),
  KEY `customerID_idx` (`customerID`),
  CONSTRAINT `customerID` FOREIGN KEY (`customerID`) REFERENCES `users` (`userID`),
  CONSTRAINT `flightID` FOREIGN KEY (`flightNumber`) REFERENCES `flight` (`flightnumID`)
) ENGINE=InnoDB;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `restrictions`
--

DROP TABLE IF EXISTS `restrictions`;
CREATE TABLE `restrictions` (
  `type` varchar(255) NOT NULL,
  `severity` int DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`type`)
) ENGINE=InnoDB;

--
-- Dumping data for table `restrictions`
--

LOCK TABLES `restrictions` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `route`
--

DROP TABLE IF EXISTS `route`;
CREATE TABLE `route` (
  `name` varchar(255) NOT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `restriction` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`name`),
  KEY `restriction_idx` (`restriction`),
  KEY `origin_idx` (`origin`),
  KEY `destination_idx` (`destination`),
  CONSTRAINT `destination` FOREIGN KEY (`destination`) REFERENCES `airport` (`airportCode`),
  CONSTRAINT `origin` FOREIGN KEY (`origin`) REFERENCES `airport` (`airportCode`),
  CONSTRAINT `restriction` FOREIGN KEY (`restriction`) REFERENCES `restrictions` (`type`)
) ENGINE=InnoDB;

--
-- Dumping data for table `route`
--

LOCK TABLES `route` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `creditcardnumber` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES (1,'gvanceUser','Greg Vance','password','2500 University Dr NW, Calgary, Alberta','4500881235781234');
UNLOCK TABLES;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-11 22:30:53
