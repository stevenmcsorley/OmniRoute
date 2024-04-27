CREATE DATABASE IF NOT EXISTS AllSeeingEye;

USE AllSeeingEye;

CREATE TABLE IF NOT EXISTS Companies (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    ContactPerson VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Buses (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CompanyId INT NOT NULL,
    LicensePlate VARCHAR(255),
    Capacity INT,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id)
);

CREATE TABLE IF NOT EXISTS Routes (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CompanyId INT NOT NULL,
    BusId INT NOT NULL,
    Name VARCHAR(255),
    DepartureTime DATETIME,
    ArrivalTime DATETIME,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
    FOREIGN KEY (BusId) REFERENCES Buses(Id)
);

CREATE TABLE IF NOT EXISTS Workers (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CompanyId INT NOT NULL,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255),
    Phone VARCHAR(255),
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id)
);

CREATE TABLE IF NOT EXISTS Tickets (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    WorkerId INT NOT NULL,
    RouteId INT NOT NULL,
    IssueDate DATETIME,
    ExpiryDate DATETIME,
    FOREIGN KEY (WorkerId) REFERENCES Workers(Id),
    FOREIGN KEY (RouteId) REFERENCES Routes(Id)
);

CREATE TABLE IF NOT EXISTS Drivers (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    CompanyId INT NOT NULL,
    RouteId INT NOT NULL,
    Name VARCHAR(255),
    LicenseNumber VARCHAR(255),
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
    FOREIGN KEY (RouteId) REFERENCES Routes(Id)
);

CREATE TABLE IF NOT EXISTS Passengers (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    WorkerId INT NOT NULL,
    TicketId INT NOT NULL,
    BoardingStatus VARCHAR(255),
    RouteId INT NOT NULL,
    CompanyId INT NOT NULL,
    DriverId INT DEFAULT NULL,
    FOREIGN KEY (WorkerId) REFERENCES Workers(Id),
    FOREIGN KEY (TicketId) REFERENCES Tickets(Id),
    FOREIGN KEY (RouteId) REFERENCES Routes(Id),
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id)
);

