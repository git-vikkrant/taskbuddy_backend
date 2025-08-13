# TaskBuddy Backend Flow

This document explains the end-to-end flow of the **Add Task** functionality in the TaskBuddy project.

## **Backend Flow**

```plaintext
[Frontend UI - React]
       |
       | 1. User clicks "Add Task"
       v
[Axios / Fetch API Request]
       |
       | POST /tasks
       | Body: { title, description, category }
       | Headers: Authorization: Bearer <JWT>
       v
[Express Server - server.js]
       |
       | -> Routes match: /tasks → tasks.js
       v
[Auth Middleware - authMiddleware.js]
       |
       | 2. Extract token from Authorization header
       | 3. Verify token using JWT_SECRET
       | 4. Attach decoded user_id to req.user
       v
[Task Route Handler - tasks.js]
       |
       | 5. Use req.user.id + task data to build SQL INSERT
       | 6. Send query to PostgreSQL
       v
[PostgreSQL Database - Neon]
       |
       | 7. Insert data into "tasks" table
       | 8. Return inserted task row
       v
[Express Response]
       |
       | 9. Send JSON response back to frontend
       v
[Frontend UI - React]
       |
       | 10. Update state → new task appears in UI
```

---

## **Step-by-Step Explanation**

1. **User Action**: The user clicks the **Add Task** button in the React UI.
2. **API Request**: An HTTP `POST` request is sent to `/tasks` with the task details and JWT token in the headers.
3. **Express Server**: The request hits the Express.js server, where the `/tasks` route is matched.
4. **Authentication Middleware**:  
   - Extracts the JWT token from the Authorization header.  
   - Verifies the token using `JWT_SECRET`.  
   - Attaches the decoded `user_id` to `req.user`.
5. **Task Handler**: The `/tasks` route handler constructs a parameterized SQL query using the `user_id` and task data.
6. **Database Operation**: The SQL query is sent to the PostgreSQL database (Neon).  
   - The task is inserted into the `tasks` table.  
   - The newly inserted row is returned.
7. **Response to Client**: The backend sends the inserted task as JSON.
8. **UI Update**: React updates the local state so the new task appears instantly without a page refresh.

---

## **Technologies Used**

- **Frontend**: React, Axios
- **Backend**: Node.js, Express.js
- **Authentication**: JWT (JSON Web Token)
- **Database**: PostgreSQL (Neon)
- **Hosting**: Render (Backend), Netlify/Vercel (Frontend)

---

## **Security Notes**

- Always validate and sanitize user input.
- Use environment variables for sensitive data (`DATABASE_URL`, `JWT_SECRET`).
- Tokens must be sent in the `Authorization` header as `Bearer <token>`.

---

## **Author**

Project created by **Vikrant** for interview demonstration.
