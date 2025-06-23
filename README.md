# 🧠 Circa Backend Task – Dev Mind Speed Game API

This is a **backend-only** project for the Circa hiring challenge. The game is designed to test a player's speed and accuracy in solving math problems using **RESTful APIs**. **No frontend** is used—everything is done through tools like **Postman** or **cURL**.

---

## 🚀 Tech Stack

- Node.js with Express.js
- MongoDB using Mongoose ODM

---

## 📂 Project Setup

1. **Clone the repo**:

```bash
git clone https://github.com/RamziZamil/Circa-Task.git
cd Backend
```

2.  **Install dependencies**:

```bash
npm install
```

3. **Create a `.env` file**:

```bash
PORT=5000
MONGO_URI=your-mongodb-connection-string
```

4. **Run the server:**

```bash
nodemon server.js
```

---

## 🎮 Game Flow & API Endpoints

### 1️⃣ Start a New Game

**POST** `/game/start`

**Request Body**:

```bash {
  "player": "YourName",
  "level": 2
}
```

**Response:**

- A math question

- `submit_url` to send your answer

- `time_started`

### 2️⃣ Submit an Answer

**POST** `/game/:id/submit`

**Request Body**:

`{  "answer":  123.45  }`

**Response**:

- `result`: Correct or incorrect message
- `time_taken` to answer
- `next_question`
- `current_score`

### 3️⃣ End the Game

**GET** `/game/:id/end`

**Response**:

- `player` name and difficulty
- `current_score`
- `total_time_spent`
- `best_score`: fastest correct answer
- Full history of questions and answers

---

## 🎯 Difficulty Levels

| Level | Operands | Digit Length | Operations |
| ----- | -------- | ------------ | ---------- |
| 1     | 2        | 1 digit      | + - \* /   |
| 2     | 3        | 2 digits     | + - \* /   |
| 3     | 4        | 3 digits     | + - \* /   |
| 4     | 5        | 4 digits     | + - \* /   |

## 📌 Sample cURL Commands

### ✅ Start a Game

`curl -X POST http://localhost:5000/game/start \
  -H "Content-Type: application/json" \
  -d '{"player": "RamziDev", "level": 2}'`

---

### ✅ Submit an Answer

`curl -X POST http://localhost:5000/game/<game_id>/submit \
  -H "Content-Type: application/json" \
  -d '{"answer": 45.6}'`

---

### ✅ End the Game

`curl -X GET http://localhost:5000/game/<game_id>/end`
