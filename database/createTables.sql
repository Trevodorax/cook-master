CREATE TABLE IF NOT EXISTS USERS(
   Id_USERS COUNTER,
   email VARCHAR(100) NOT NULL,
   password CHAR(255) NOT NULL,
   firstName VARCHAR(50) NOT NULL,
   lastName VARCHAR(50) NOT NULL,
   profilePicture VARCHAR(100),
   PRIMARY KEY(Id_USERS),
   UNIQUE(email)
);

INSERT INTO USERS (email, password, firstName, lastName)
VALUES  ('test1@gmail.com', 'passwd', 'John', 'Doe'),
        ('test2@gmail.com', 'passwd', 'Jane', 'Kent'),
        ('test3@gmail.com', 'passwd', 'Rick', 'Merry');

CREATE TABLE IF NOT EXISTS MANAGER(
   Id_MANAGER COUNTER,
   isItemManager LOGICAL,
   isClientManager LOGICAL,
   isContractorManager LOGICAL,
   Id_USERS INT NOT NULL,
   PRIMARY KEY(Id_MANAGER),
   UNIQUE(Id_USERS),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS)
);

CREATE TABLE IF NOT EXISTS CONTRACTORS(
   Id_CONTRACTORS COUNTER,
   presentation TEXT,
   Id_USERS INT NOT NULL,
   PRIMARY KEY(Id_CONTRACTORS),
   UNIQUE(Id_USERS),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS)
);

CREATE TABLE IF NOT EXISTS PREMISES(
   Id_PREMISES COUNTER,
   streetNumber SMALLINT,
   streetName VARCHAR(100),
   city VARCHAR(100),
   country VARCHAR(50),
   PRIMARY KEY(Id_PREMISES)
);

CREATE TABLE IF NOT EXISTS COOKING_SPACES(
   Id_COOKING_SPACES COUNTER,
   size DECIMAL(5,2),
   name VARCHAR(50),
   PricePerHour CURRENCY,
   Id_PREMISES INT NOT NULL,
   PRIMARY KEY(Id_COOKING_SPACES),
   FOREIGN KEY(Id_PREMISES) REFERENCES PREMISES(Id_PREMISES)
);

CREATE TABLE IF NOT EXISTS COOKING_ITEMS(
   Id_COOKING_ITEMS COUNTER,
   name VARCHAR(50),
   status VARCHAR(20),
   Id_COOKING_SPACES INT NOT NULL,
   PRIMARY KEY(Id_COOKING_ITEMS),
   FOREIGN KEY(Id_COOKING_SPACES) REFERENCES COOKING_SPACES(Id_COOKING_SPACES)
);

CREATE TABLE IF NOT EXISTS SUBSCRIPTION(
   Id_SUBSCRIPTION COUNTER,
   name VARCHAR(50),
   price CURRENCY,
   picture VARCHAR(50),
   PRIMARY KEY(Id_SUBSCRIPTION)
);

CREATE TABLE IF NOT EXISTS CONVERSATIONS(
   Id_CONVERSATIONS COUNTER,
   Id_USER1 INT
   Id_USER2 INT
   PRIMARY KEY(Id_CONVERSATIONS)
   FOREIGN KEY(Id_USER1) REFERENCES USERS(Id_USERS),
   FOREIGN KEY(Id_USER2) REFERENCES USERS(Id_USERS),
);

CREATE TABLE IF NOT EXISTS MESSAGES(
   Id_MESSAGES COUNTER,
   content TEXT,
   isFromUser1 LOGICAL,
   Id_CONVERSATIONS INT NOT NULL,
   PRIMARY KEY(Id_MESSAGES),
   FOREIGN KEY(Id_CONVERSATIONS) REFERENCES CONVERSATIONS(Id_CONVERSATIONS)
);

CREATE TABLE IF NOT EXISTS REWARDS(
   Id_REWARDS COUNTER,
   name VARCHAR(100),
   fidelityPointsCost INT,
   PRIMARY KEY(Id_REWARDS)
);

CREATE TABLE IF NOT EXISTS COURSES(
   Id_COURSES COUNTER,
   name VARCHAR(100),
   description TEXT,
   level BYTE,
   price CURRENCY,
   Id_CONTRACTORS INT NOT NULL,
   PRIMARY KEY(Id_COURSES),
   FOREIGN KEY(Id_CONTRACTORS) REFERENCES CONTRACTORS(Id_CONTRACTORS)
);

CREATE TABLE IF NOT EXISTS LESSONS(
   Id_LESSONS COUNTER,
   content TEXT,
   PRIMARY KEY(Id_LESSONS)
);

CREATE TABLE IF NOT EXISTS SHOP_ITEM(
   Id_SHOP_ITEM COUNTER,
   name VARCHAR(100),
   description TEXT,
   price CURRENCY,
   stock BIGINT,
   PRIMARY KEY(Id_SHOP_ITEM)
);

CREATE TABLE IF NOT EXISTS FOOD(
   Id_FOOD COUNTER,
   name VARCHAR(100),
   description TEXT,
   price CURRENCY,
   PRIMARY KEY(Id_FOOD)
);

CREATE TABLE IF NOT EXISTS INGREDIENT(
   Id_INGREDIENT COUNTER,
   isAllergen LOGICAL,
   Id_COOKING_SPACES INT NOT NULL,
   PRIMARY KEY(Id_INGREDIENT),
   FOREIGN KEY(Id_COOKING_SPACES) REFERENCES COOKING_SPACES(Id_COOKING_SPACES)
);

CREATE TABLE IF NOT EXISTS CLIENTS(
   Id_CLIENTS COUNTER,
   fidelityPoints INT,
   streetNumber SMALLINT,
   streetName VARCHAR(100),
   city VARCHAR(100),
   country VARCHAR(50),
   Id_SUBSCRIPTION INT,
   Id_USERS INT NOT NULL,
   PRIMARY KEY(Id_CLIENTS),
   UNIQUE(Id_USERS),
   FOREIGN KEY(Id_SUBSCRIPTION) REFERENCES SUBSCRIPTION(Id_SUBSCRIPTION),
   FOREIGN KEY(Id_USERS) REFERENCES USERS(Id_USERS)
);

CREATE TABLE IF NOT EXISTS EVENTS(
   Id_EVENTS COUNTER,
   type VARCHAR(50),
   startTime DATETIME,
   endTime DATETIME,
   isInternal LOGICAL,
   Id_CLIENTS INT NOT NULL,
   PRIMARY KEY(Id_EVENTS),
   FOREIGN KEY(Id_CLIENTS) REFERENCES CLIENTS(Id_CLIENTS)
);

CREATE TABLE IF NOT EXISTS COMMENTS(
   Id_COMMENTS COUNTER,
   grade DECIMAL(2,1) NOT NULL,
   content TEXT,
   Id_EVENTS INT NOT NULL,
   PRIMARY KEY(Id_COMMENTS),
   FOREIGN KEY(Id_EVENTS) REFERENCES EVENTS(Id_EVENTS)
);

CREATE TABLE IF NOT EXISTS POSTS(
   Id_POSTS COUNTER,
   content TEXT,
   Id_CLIENTS INT NOT NULL,
   PRIMARY KEY(Id_POSTS),
   FOREIGN KEY(Id_CLIENTS) REFERENCES CLIENTS(Id_CLIENTS)
);

CREATE TABLE IF NOT EXISTS ORDERS(
   Id_ORDERS COUNTER,
   status VARCHAR(20),
   bill VARCHAR(100),
   Id_CLIENTS INT NOT NULL,
   PRIMARY KEY(Id_ORDERS),
   FOREIGN KEY(Id_CLIENTS) REFERENCES CLIENTS(Id_CLIENTS)
);

CREATE TABLE IF NOT EXISTS PARTICIPATES(
   Id_CLIENTS INT,
   Id_EVENTS INT,
   PRIMARY KEY(Id_CLIENTS, Id_EVENTS),
   FOREIGN KEY(Id_CLIENTS) REFERENCES CLIENTS(Id_CLIENTS),
   FOREIGN KEY(Id_EVENTS) REFERENCES EVENTS(Id_EVENTS)
);

CREATE TABLE IF NOT EXISTS ANIMATES(
   Id_CONTRACTORS INT,
   Id_EVENTS INT,
   PRIMARY KEY(Id_CONTRACTORS, Id_EVENTS),
   FOREIGN KEY(Id_CONTRACTORS) REFERENCES CONTRACTORS(Id_CONTRACTORS),
   FOREIGN KEY(Id_EVENTS) REFERENCES EVENTS(Id_EVENTS)
);

CREATE TABLE IF NOT EXISTS ORGANIZES(
   Id_MANAGER INT,
   Id_EVENTS INT,
   PRIMARY KEY(Id_MANAGER, Id_EVENTS),
   FOREIGN KEY(Id_MANAGER) REFERENCES MANAGER(Id_MANAGER),
   FOREIGN KEY(Id_EVENTS) REFERENCES EVENTS(Id_EVENTS)
);

CREATE TABLE IF NOT EXISTS IS_HOSTED(
   Id_COOKING_SPACES INT,
   Id_EVENTS INT,
   PRIMARY KEY(Id_COOKING_SPACES, Id_EVENTS),
   FOREIGN KEY(Id_COOKING_SPACES) REFERENCES COOKING_SPACES(Id_COOKING_SPACES),
   FOREIGN KEY(Id_EVENTS) REFERENCES EVENTS(Id_EVENTS)
);

CREATE TABLE IF NOT EXISTS IS_PART_OF(
   Id_COURSES INT,
   Id_LESSONS INT,
   PRIMARY KEY(Id_COURSES, Id_LESSONS),
   FOREIGN KEY(Id_COURSES) REFERENCES COURSES(Id_COURSES),
   FOREIGN KEY(Id_LESSONS) REFERENCES LESSONS(Id_LESSONS)
);

CREATE TABLE IF NOT EXISTS CONTAINS_ITEM(
   Id_ORDERS INT,
   Id_SHOP_ITEM INT,
   PRIMARY KEY(Id_ORDERS, Id_SHOP_ITEM),
   FOREIGN KEY(Id_ORDERS) REFERENCES ORDERS(Id_ORDERS),
   FOREIGN KEY(Id_SHOP_ITEM) REFERENCES SHOP_ITEM(Id_SHOP_ITEM)
);

CREATE TABLE IF NOT EXISTS CONTAINS_FOOD(
   Id_ORDERS INT,
   Id_FOOD INT,
   PRIMARY KEY(Id_ORDERS, Id_FOOD),
   FOREIGN KEY(Id_ORDERS) REFERENCES ORDERS(Id_ORDERS),
   FOREIGN KEY(Id_FOOD) REFERENCES FOOD(Id_FOOD)
);

CREATE TABLE IF NOT EXISTS ALLOWS(
   Id_SUBSCRIPTION INT,
   Id_EVENTS INT,
   PRIMARY KEY(Id_SUBSCRIPTION, Id_EVENTS),
   FOREIGN KEY(Id_SUBSCRIPTION) REFERENCES SUBSCRIPTION(Id_SUBSCRIPTION),
   FOREIGN KEY(Id_EVENTS) REFERENCES EVENTS(Id_EVENTS)
);