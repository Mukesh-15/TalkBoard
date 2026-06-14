# TalkBoard — Engineering Development Log & Architecture Documentation

## Project Overview

**TalkBoard** is a real-time collaboration platform designed to allow users to create and join discussion rooms. The current development phase focuses heavily on **authentication architecture**, **secure onboarding**, and **stateful session management**.

The primary engineering goal during this phase was to design an authentication system that:

* Prevents unverified users from accessing the application
* Supports email OTP verification
* Maintains secure JWT-based sessions
* Provides a scalable foundation for future room-based collaboration using WebSockets

---

# Problem Statement

Traditional email-password authentication alone was insufficient because:

1. Fake or invalid email registrations could occur.
2. Users could access application data immediately after signup.
3. There was no staged verification flow.
4. Session validation after refresh was missing.

The challenge was to design a secure onboarding flow while keeping the user experience smooth.

---

# Architecture Decision

Instead of immediately issuing full-access authentication tokens during signup/login, a **two-stage authentication architecture** was implemented.

### Authentication Pipeline

```text
Signup/Login
      ↓
Generate tempToken (limited permissions)
      ↓
OTP Verification
      ↓
Mark user as verified
      ↓
Generate authToken (full access)
      ↓
Validate token using /me endpoint
      ↓
Global user context available
```

This design ensures that only verified users gain access to protected application resources.

---

# Authentication Design

## 1. Signup Flow

### Objective

Allow user registration while enforcing email verification.

### Flow

```text
User Signup
      ↓
Validate username/email uniqueness
      ↓
Hash password using bcrypt
      ↓
Store user in DB (isVerified = false)
      ↓
Generate OTP
      ↓
Send email
      ↓
Return tempToken
```

### Backend Logic

The following actions occur inside `/auth/signup`:

* Validate request body
* Check if username or email already exists
* Hash password using bcrypt
* Create user
* Generate OTP
* Email OTP to user
* Return temporary JWT token

### Why tempToken?

Returning a normal auth token immediately after signup creates a security issue:

```text
User signs up
      ↓
Receives authToken
      ↓
Can access application without email verification
```

Instead, a `tempToken` was introduced.

This token:

* Identifies the user
* Allows access only to OTP verification routes
* Expires quickly (10 minutes)
* Cannot access protected app resources

Example:

```js
jwt.sign(
  {
    user: {
      id: user.id,
    },
  },
  JWT_SECRET,
  {
    expiresIn: "10m",
  }
);
```

---

## 2. Login Flow

### Objective

Support verified and unverified users differently.

### Flow

#### Verified User

```text
Login
      ↓
Validate credentials
      ↓
isVerified = true
      ↓
Return authToken
```

#### Unverified User

```text
Login
      ↓
Validate credentials
      ↓
isVerified = false
      ↓
Send OTP again
      ↓
Return tempToken
```

### Why resend OTP during login?

Users may:

* Forget to verify email
* Leave midway during signup
* Return after several days

Instead of blocking login:

```text
"Your account is not verified"
```

The system automatically resends OTP and continues onboarding.

This improves user experience significantly.

---

## 3. OTP Verification System

### Endpoint

```http
POST /auth/verify-otp
```

### Flow

```text
Receive tempToken
      ↓
Extract userId
      ↓
Fetch latest OTP
      ↓
Check expiration
      ↓
Compare bcrypt OTP hash
      ↓
Update user.isVerified = true
      ↓
Delete OTP records
      ↓
Generate authToken
```

### Why hash OTP?

OTP is hashed before storing in database.

Instead of:

```text
123456
```

Database stores:

```text
$2a$10$X....
```

Benefits:

* Prevents database leaks exposing OTPs
* Improves security standards
* Aligns with password handling practices

Verification:

```js
bcrypt.compare(otp, otpRecord.otp);
```

---

# Token Strategy

Two token system:

| Token Type | Purpose          | Expiry     | Access  |
| ---------- | ---------------- | ---------- | ------- |
| tempToken  | OTP verification | 10 minutes | Limited |
| authToken  | Full app access  | 10 days    | Full    |

### Security Benefit

Unverified users cannot access:

```text
Home page
Rooms
Protected APIs
Socket connections
User data
```

---

# Backend Architecture

## Route Structure

```text
backend/
│── routes/
│   ├── auth.js
│
│── middleware/
│   ├── verifyToken.js
│
│── services/
│   ├── otpService.js
│
│── models/
│   ├── User.js
│   ├── Otps.js
```

### Design Principle Used

**Separation of Concerns**

Responsibilities are divided:

| Layer      | Responsibility   |
| ---------- | ---------------- |
| Routes     | Request handling |
| Middleware | Token validation |
| Services   | OTP email logic  |
| Models     | Database schema  |

This improves maintainability and scalability.

---

# Frontend Architecture

## Context API Based Auth Management

Instead of prop drilling:

```text
App
 └── Home
      └── Navbar
           └── Profile
```

Global authentication state is managed using:

```text
AuthContext
```

### Responsibilities

AuthContext manages:

```text
signup()
login()
verifyOtp()
logout()
fetchUser()
user state
loading state
```

This prevents duplicate authentication logic across components.

---

# Session Persistence Strategy

### Problem

After refresh:

```text
User gets logged out
```

because React state resets.

### Solution

Store JWT in:

```js
localStorage
```

Then validate on app startup.

---

# `/auth/me` Endpoint Design

### Why Introduced?

Problem:

After refresh:

```text
React state becomes empty
```

But token still exists.

Need:

```text
Validate token
Fetch user
Restore session
```

### Endpoint

```http
GET /auth/me
```

### Flow

```text
Token exists?
      ↓
Verify JWT
      ↓
Find user
      ↓
Return user details
```

Response:

```json
{
  "success": true,
  "user": {
    "id": "...",
    "username": "mukesh",
    "email": "..."
  }
}
```

### Why return user details?

Needed for:

```text
Greeting user
Room ownership
Profile UI
Socket identity
Future permissions
```

Example:

```jsx
Good Evening, Mukesh
```

Without additional API requests.

---

# Protected Routing Design

To prevent unauthorized access:

```text
User manually opens "/"
```

A route protection system was planned.

Logic:

```text
Token missing?
      ↓
Redirect /auth
```

Future structure:

```jsx
<ProtectedRoute>
   <Home />
</ProtectedRoute>
```

---

# Logout Design

### Objective

Properly terminate session.

### Flow

```text
Logout
      ↓
Backend sets isOnline = false
      ↓
Frontend clears token
      ↓
Redirect to auth
```

### Why backend logout?

Needed for:

```text
Presence tracking
Last seen
Online users
Socket cleanup
```

Useful for future realtime collaboration.

---

# Security Considerations

### Password Hashing

Passwords hashed using:

```text
bcrypt
```

Never stored in plaintext.

---

### OTP Hashing

OTP also hashed.

Improves resilience against database leaks.

---

### JWT Authentication

Stateless authentication using:

```text
jsonwebtoken
```

Avoids server session storage.

---

### Token Expiry

Short-lived temp token:

```text
10 minutes
```

Prevents abuse.

Full auth token:

```text
10 days
```

Balances usability and security.

---

# Problems Faced & Debugging History

## Problem 1 — `ERR_HTTP_HEADERS_SENT`

### Error

```text
Cannot set headers after they are sent to the client
```

### Cause

Response was being sent multiple times inside middleware.

Example:

```js
res.status(401).json(...)
next()
```

Both executed.

### Solution

Added:

```js
return res.status(...)
```

to stop execution immediately.

---

## Problem 2 — 401 Unauthorized During OTP Verification

### Error

```text
Please authenticate using a valid token
```

### Cause

Token header mismatch.

Frontend:

```js
authToken
```

Backend expected:

```js
req.header("authToken")
```

Also temp token was missing.

### Solution

Store temp token after signup/login:

```js
localStorage.setItem("token", json.tempToken)
```

Send during OTP verification.

---

## Problem 3 — 403 Forbidden (`Verify OTP First`)

### Cause

Protected routes blocked tempToken.

Middleware logic incorrectly assumed:

```text
Only authToken valid
```

### Solution

Allowed tempToken access only for:

```text
/auth/verify-otp
```

while protecting other routes.

---

## Problem 4 — `useNavigate()` Error

### Error

```text
useNavigate() may be used only in the context of a Router
```

### Cause

`AuthProvider` was rendered outside:

```jsx
<BrowserRouter>
```

### Solution

Correct hierarchy:

```jsx
<BrowserRouter>
   <AuthProvider>
      <App />
   </AuthProvider>
</BrowserRouter>
```

---

## Problem 5 — App Crash (`user.username`)

### Error

```text
Cannot read properties of null
```

### Cause

Initial render:

```js
user = null
```

before fetch completed.

### Solution

Safe optional chaining:

```jsx
user?.username
```

---

## Problem 6 — Home Rendering Twice

### Observation

Console logs appeared twice.

### Cause

React Strict Mode.

Development-only behavior:

```jsx
<React.StrictMode>
```

renders components twice to detect side effects.

### Solution

No actual issue.

Accepted as expected development behavior.

---

## Problem 7 — Chrome Password Breach Warning

### Observation

Chrome warned:

```text
Password found in data breach
```

### Cause

Test password existed in public leak databases.

### Resolution

No application vulnerability.

Issue was weak/reused password.

---

# Lessons Learned

### 1. Authentication is More Than Login

Proper auth includes:

```text
Verification
Session restoration
Route protection
Logout
Token expiry
```

---

### 2. Middleware Mistakes Cause Hidden Bugs

Missing `return` statements can create severe response issues.

---

### 3. React State Resets on Refresh

Persistent authentication requires:

```text
JWT + localStorage + /me validation
```

---

### 4. Security Should Be Designed Early

Retrofitting security later becomes expensive.

---

# Current System Status

Implemented:

```text
Signup
Login
OTP verification
Email sending
JWT authentication
tempToken architecture
/me validation
User context
Session persistence
Logout
Protected access logic
```

Pending:

```text
ProtectedRoute
Socket authentication
Room system
Realtime collaboration
Presence tracking
Forgot password
Google OAuth
```

---

# Why This Architecture Is Strong

This design is production-oriented because:

1. **Unverified users cannot access app data**
2. **Authentication is stateless and scalable**
3. **Session restoration works after refresh**
4. **Security layers exist for OTP and passwords**
5. **Architecture follows separation of concerns**
6. **Frontend auth state is centralized**
7. **Ready for Socket.IO authentication**

This creates a strong foundation for scaling TalkBoard into a realtime collaborative platform.

## Author Notes

This document records both the engineering decisions and debugging journey of TalkBoard’s authentication system and will continue evolving as the project grows.
