# TalkBoard 

**TalkBoard** is a real-time collaborative communication platform where users can create rooms, join video calls, and edit a shared notepad simultaneously.

Built using the **MERN Stack**, **Socket.IO**, and **WebRTC**, TalkBoard enables seamless communication and real-time collaboration for teams, students, and remote users.

---

##  Features

###  Secure Authentication System
- User Signup & Signin
- Email OTP Verification
- JWT Authentication
- Temporary Authentication Tokens
- Protected Routes
- Session Handling
- Secure Logout

###  Real-Time Communication
- Video Calling using **WebRTC**
- Audio Calling
- Multi-user Room System
- Real-time peer connection management

###  Collaborative Workspace
- Shared Notepad
- Simultaneous Editing
- Live Sync using **Socket.IO**
- Room-based collaboration

###  Room Management
- Create Room
- Join Room
- Room-based access control
- Real-time participant updates

---

#  Tech Stack

## Frontend
- React.js
- React Router DOM
- Context API
- Tailwind CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Real-Time Technologies
- Socket.IO
- WebRTC

## Authentication & Security
- JWT (JSON Web Tokens)
- bcrypt.js
- Email OTP Verification
- Nodemailer

---

#  Authentication Architecture

TalkBoard follows a **Two-Phase Authentication Architecture** for better security.

Instead of giving full access immediately after entering username/password, users must first verify ownership of their email through OTP verification.

---

## Authentication Flow

### 1️ Signup / Signin

User enters credentials:

```text
Username + Email + Password
```

Backend:

- Validates credentials
- Hashes password using bcrypt
- Creates user (`isVerified = false`)
- Sends OTP to registered email
- Returns a **Temporary Token**

Response:

```json
{
  "success": true,
  "tempToken": "jwt-token"
}
```

At this stage:

❌ User **cannot access app data**  
❌ Cannot create rooms  
❌ Cannot access protected routes

Only:

✅ OTP Verification screen is accessible

---

### 2️ OTP Verification

User enters OTP.

Backend:

- Verifies temp token
- Validates OTP
- Checks OTP expiry
- Compares hashed OTP using bcrypt
- Marks user as verified

```js
isVerified = true
isLoggedIn = true
```

Then backend issues the **real JWT auth token**.

Response:

```json
{
  "success": true,
  "authToken": "real-jwt-token"
}
```

Now user gets full access.

---

### 3️ Protected App Access

Every secured route uses authentication middleware.

Example protected routes:

```text
/create-room
/profile
/dashboard
/logout
```

Middleware checks:

```text
1. Valid JWT
2. User exists
3. OTP verified
4. Logged-in session active
```

Only then access is granted.

---

### 4️ Logout

On logout:

Backend updates:

```js
isLoggedIn = false
```

JWT token is removed from local storage.

This prevents unauthorized reuse of old sessions.

---

#  Architecture Design

TalkBoard follows a **Layered Modular Architecture**.

```text
Client (React)
      ↓
REST APIs (Express)
      ↓
Authentication Middleware
      ↓
Controllers / Routes
      ↓
Database (MongoDB)
```

For real-time communication:

```text
Socket.IO Server
      ↓
Room Events
      ↓
Real-Time Collaboration
```

For video/audio:

```text
WebRTC Peer Connections
      ↓
Direct Browser-to-Browser Streaming
```

---

# Why This Authentication Design Is Better?

Instead of directly authenticating users after password verification, TalkBoard uses a **temporary authorization stage**.

### ❌ Traditional Flow

```text
Password Correct
      ↓
Full Access Granted
```

Problem:

If credentials are compromised, attacker instantly gains access.

---

###  TalkBoard Secure Flow

```text
Password Correct
      ↓
Temporary Token
      ↓
OTP Verification
      ↓
Real JWT Access
```

Benefits:

### 1. Better Security
Even if password leaks, attacker still needs email OTP.

### 2. Access Isolation
Users cannot access protected APIs before verification.

### 3. Safer Session Handling
Only verified users receive full JWT access.

### 4. Reduced Unauthorized Access
Temp token has limited permissions and expiry.

### 5. Clean Separation of Responsibilities
Different middleware for:

```text
OTP verification
Protected routes
Session validation
```

This makes the system easier to maintain and scale.

---

#  Security Practices Implemented

### Password Hashing
Passwords are hashed using **bcrypt**.

```text
Plain Password ❌
Hashed Password ✅
```

---

### OTP Hashing
OTPs are hashed before storing in database.

```text
Raw OTP → bcrypt hash → Database
```

Meaning:

Even database leaks won't expose OTPs.

---

### JWT Authentication

Two token strategy:

#### Temporary JWT

Used only for:

```text
/verify-otp
```

Limited access.

Expires quickly.

```text
10 minutes
```

---

#### Full JWT

Issued only after OTP verification.

Used for:

```text
All protected APIs
```

---

### Route Protection

Middleware prevents access if:

- Token missing
- Invalid token
- User not verified
- Session expired
- User logged out

---

#  Project Structure

```text
talkboard/
│
├── frontend/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── App.jsx
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   └── server.js
│
└── README.md
```

---

#  Installation

## Clone Repository

```bash
git clone <repo-url>
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create `.env`

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

---

#  Future Enhancements

- Screen Sharing
- Chat Messaging
- Google Authentication
- Room Passwords
- Role-Based Permissions
- File Sharing
- End-to-End Encryption
- Meeting Recording

---

#  Why TalkBoard?

TalkBoard combines:

 Communication  
 Collaboration  
 Security

into a single platform.

Instead of switching between multiple apps for meetings and collaborative editing, TalkBoard provides everything inside one real-time workspace.

---

##  Author

**Mukesh D**

Built as a full-stack real-time collaboration platform using modern web technologies.
