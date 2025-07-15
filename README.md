# 🎟️ Event Management Backend

A RESTful API built using **Node.js**, **Express**, and **PostgreSQL** to manage events, user registrations, and analytics. It supports event creation, registration handling, upcoming event listing, and event statistics.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **pg** (PostgreSQL client)
- **dotenv**
- **CORS**

---

## 📁 Folder Structure
```event-management-backend/
├── config/
│   └── db.js                # PostgreSQL DB connection
│   └── initDb.js            # Table creation logic
├── controllers/
│   ├── eventController.js   # Event-related endpoints
│   └── userController.js    # User creation endpoint
├── routes/
│   ├── eventRoutes.js       # Routes for event APIs
│   └── userRoutes.js        # Routes for user APIs
├── schema/
│   ├── eventSchema.js       # SQL: CREATE TABLE for events
│   ├── registerationSchema.js  # SQL: CREATE TABLE for registrations
│   └── userSchema.js        # SQL: CREATE TABLE for users
├── .env                     # Environment variables (DB_URL, PORT)
├── .gitignore
├── index.js                 # Entry point – sets up Express, routes, DB connect
├── package.json
└── README.md                # Placeholder README (needs content)
```


---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/MohdShadab552004/event-management-backend.git
cd event-management-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up .env File
Create a .env file in the root and add your PostgreSQL URL:

```bash
PORT=5000
DB_URL=your_postgres_connection_string
```
### 4. Run the Server
```bash
npm start
```
The server will start on http://localhost:5000.


### 📌 API Endpoints

### ✅ Create Event
POST /event/create
```bash
Request Body:
{
  "title": "Tech Conference 2025",
  "datetime": "2025-08-10T10:00:00Z",
  "location": "Mumbai Convention Center",
  "capacity": 300
}
```
Response:
```bash
{
  "eventId": 1,
  "message": "Event created successfully"
}
```

### 📄 Get Event Details
GET /event/detail
Response:
```bash
{
  "event": {
    "id": 1,
    "title": "Tech Conference 2025",
    "datetime": "2025-08-10T10:00:00.000Z",
    "location": "Mumbai Convention Center",
    "capacity": 300
  },
  "registeredUsers": [
    {
      "id": 10,
      "name": "Alice",
      "email": "alice@example.com"
    }
  ]
}
```

### 🧑 Register for Event
POST /event/register
```bash
Request Body:
{
  "userId": 5,
  "eventId": 1
}
```
###Constraints:
```
Cannot register for past events
Cannot register if event is full
No duplicate registrations
```
Response:
```bash
{
  "message": "Registration successful"
}
```

### ❌ Cancel Registration
DELETE /event/cancel
```bash
Request Body:
{
  "userId": 5,
  "eventId": 1
}
```
Response:
```bash
{
  "message": "Registration cancelled"
}
```

### 📆 List Upcoming Events
GET /event/upcoming
Response:
```bash
{
  "events": [
    {
      "id": 1,
      "title": "Tech Conference 2025",
      "datetime": "2025-08-10T10:00:00Z",
      "location": "Mumbai Convention Center",
      "capacity": 300
    }
  ]
}
```
###Sorted by:
```
First: datetime ASC
Then: location ASC
```

### 📊 Event Statistics
GET /event/stats/:eventId
Response:
```bash
{
  "totalRegistrations": 45,
  "remainingCapacity": 255,
  "capacityUsedPercent": "15.00%"
}
```
