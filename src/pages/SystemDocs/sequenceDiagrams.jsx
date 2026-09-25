export const sequenceDiagrams = {
    auth: [
        {
            title: 'User Registration & JWT Generation',
            description: 'The step-by-step sequence of interactions between the Client, API, and Database during user sign-up.',
            code: `
sequenceDiagram
    actor User
    participant Client as Frontend (React)
    participant API as Backend (Node.js/Express)
    participant DB as Database (PostgreSQL)

    User->>Client: Enters details (Email, Password, Role)
    User->>Client: Clicks "Register"
    Client->>API: POST /api/auth/register (payload)
    
    API->>DB: Check if email exists
    alt Email exists
        DB-->>API: Returns true
        API-->>Client: 400 Bad Request (Email already in use)
        Client-->>User: Displays error message
    else Email is new
        DB-->>API: Returns false
        API->>API: Hash password (bcrypt)
        API->>DB: INSERT INTO Users (details, hashed_password)
        DB-->>API: User record created
        API->>API: Generate JWT Token
        API-->>Client: 201 Created (Token + User data)
        Client->>Client: Store Token (LocalStorage/Cookie)
        Client-->>User: Redirects to Dashboard
    end
      `
        }
    ],
    property: [
        {
            title: 'Property Creation & Image Uploads',
            description: 'The flow of an owner creating a new listing, including uploading images directly to cloud storage via presigned URLs.',
            code: `
sequenceDiagram
    actor Owner
    participant Client as Frontend (React)
    participant API as Backend (Node.js)
    participant Cloud as Cloud Storage (S3)
    participant DB as Database (PostgreSQL)

    Owner->>Client: Fills property details & selects images
    Owner->>Client: Clicks "Publish Listing"
    
    rect rgb(40, 40, 40)
        Note right of Client: Step 1: Upload Images
        Client->>API: GET /api/upload/presigned-urls
        API-->>Client: Returns presigned URLs
        Client->>Cloud: PUT images directly to Cloud storage
        Cloud-->>Client: 200 OK (Image uploaded)
    end
    
    rect rgb(50, 50, 50)
        Note right of Client: Step 2: Save Property Data
        Client->>API: POST /api/properties (details + Image URLs)
        API->>DB: INSERT INTO Properties
        DB-->>API: Property Created (ID)
        API-->>Client: 201 Created (Success)
        Client-->>Owner: Redirect to "My Properties"
    end
      `
        },
        {
            title: 'Search & Filter Execution',
            description: 'The process of a student searching for properties with specific filters and the resulting map/list updates.',
            code: `
sequenceDiagram
    actor Student
    participant Client as Frontend (React)
    participant API as Backend (Node.js)
    participant DB as Database (PostgreSQL)

    Student->>Client: Enters search criteria (location, price, amenities)
    Client->>Client: Debounce input (wait 300ms)
    Client->>API: GET /api/properties/search?priceMax=X&loc=Y
    
    API->>DB: SELECT * FROM Properties WHERE conditions
    DB-->>API: Returns matching records
    API-->>Client: 200 OK (JSON array of properties)
    
    Client->>Client: Update interactive Map markers
    Client->>Client: Update side List view
    Client-->>Student: Displays formatted results
      `
        }
    ],
    booking: [
        {
            title: 'Booking Request & Approval',
            description: 'The process of a student requesting to book a property, and the owner reviewing and approving the request.',
            code: `
sequenceDiagram
    actor Student
    actor Owner
    participant API as Backend (Node.js)
    participant DB as Database (PostgreSQL)

    Student->>API: POST /api/bookings (property_id, dates)
    API->>DB: INSERT INTO Bookings (status: 'pending')
    API-->>Owner: Emit Notification (New Booking Request)
    API-->>Student: 201 Created (Booking Pending)
    
    Owner->>API: GET /api/bookings/pending
    API-->>Owner: Returns pending requests
    Owner->>API: PUT /api/bookings/:id/approve
    API->>DB: UPDATE Bookings SET status = 'approved'
    API-->>Student: Emit Notification (Booking Approved)
    API-->>Owner: 200 OK (Approved)
      `
        },
        {
            title: 'Digital Lease Execution',
            description: 'The automated flow for generating and digitally signing a lease agreement between the student and owner.',
            code: `
sequenceDiagram
    actor Student
    actor Owner
    participant API as Backend (Node.js)
    participant DB as Database (PostgreSQL)
    
    Note over API: Triggered after booking approval & initial payment
    
    API->>API: Generate PDF Lease Agreement
    API->>DB: INSERT INTO DigitalLeases (status: 'pending_student')
    API-->>Student: Notification: Lease Ready to Sign
    
    Student->>API: POST /api/leases/:id/sign (student_signature)
    API->>DB: UPDATE DigitalLeases (status: 'pending_owner')
    API-->>Owner: Notification: Lease signed by student
    
    Owner->>API: POST /api/leases/:id/sign (owner_signature)
    API->>DB: UPDATE DigitalLeases (status: 'active')
    API-->>Student: Notification: Lease fully executed
    API-->>Owner: 200 OK (Lease Active)
      `
        }
    ],
    payments: [
        {
            title: 'PayHere Payment Integration',
            description: 'The secure checkout flow involving hash generation on the backend, redirection to PayHere, and asynchronous webhook verification.',
            code: `
sequenceDiagram
    actor User
    participant Client as Frontend (React)
    participant API as Backend (Node.js)
    participant PayHere as PayHere Gateway
    participant DB as Database (PostgreSQL)

    User->>Client: Clicks "Pay Now"
    Client->>API: POST /api/payments/hash (order_id, amount)
    API->>API: Generate MD5 Hash (merchant_secret, order_id, amount, currency)
    API-->>Client: 200 OK (Hash & Order details)
    
    Client->>PayHere: Redirects to Checkout (payhere.js modal)
    User->>PayHere: Enters card details & authenticates
    
    par Async Webhook
        PayHere->>API: POST /api/payments/webhook (payment status payload)
        API->>API: Verify MD5 Signature using payload + merchant_secret
        alt Signature Valid & Status == 2 (Success)
            API->>DB: UPDATE Invoices SET status = 'paid'
            API->>DB: INSERT INTO Transactions
            API-->>PayHere: 200 OK (Webhook Received)
        else Invalid Signature
            API-->>PayHere: 400 Bad Request
        end
    and Client Polling/Redirect
        PayHere-->>Client: Redirects to Return URL
        Client->>API: GET /api/payments/status/:order_id
        API-->>Client: 200 OK (Status: paid)
        Client-->>User: Displays Success Screen
    end
      `
        }
    ],
    social: [
        {
            title: 'Roommate Matching (Swipes)',
            description: 'The process of a user swiping on profiles, resulting in a mutual match and chat room initialization.',
            code: `
sequenceDiagram
    actor UserA
    actor UserB
    participant API as Backend (Node.js)
    participant DB as Database (PostgreSQL)

    UserA->>API: POST /api/swipes (target: UserB, action: 'right')
    API->>DB: INSERT INTO Swipes
    API->>DB: Check if UserB swiped 'right' on UserA
    alt Mutual Match
        DB-->>API: Match Found
        API->>DB: INSERT INTO Matches & ChatRooms
        API-->>UserA: 201 Created (Match + ChatRoom ID)
        API-->>UserB: Push Notification (New Match!)
    else No Match Yet
        DB-->>API: No mutual swipe
        API-->>UserA: 200 OK (Swipe recorded)
    end
      `
        },
        {
            title: 'Real-time Chat via WebSocket',
            description: 'Two users exchanging messages in real-time through a WebSocket connection.',
            code: `
sequenceDiagram
    actor UserA
    actor UserB
    participant Client as Frontend
    participant WS as WebSocket Server
    participant DB as Database

    UserA->>Client: Types message & hits Send
    Client->>WS: Emit 'send_message' (room_id, payload)
    
    WS->>DB: Save message to DB asynchronously
    WS->>WS: Identify connected clients in room_id
    
    alt UserB is online
        WS-->>UserB: Emit 'receive_message' (payload)
    else UserB is offline
        WS-->>UserB: Send Push Notification via FCM/APNs
    end
    
    WS-->>UserA: Emit 'message_delivered'
      `
        }
    ],
    admin: [
        {
            title: 'Support Ticket Resolution',
            description: 'The flow of a user opening a ticket and an admin claiming and resolving it.',
            code: `
sequenceDiagram
    actor User
    actor Admin
    participant API as Backend
    participant DB as Database

    User->>API: POST /api/tickets (subject, description)
    API->>DB: INSERT INTO SupportTickets
    API-->>User: 201 Created
    
    Admin->>API: GET /api/tickets?status=open
    API-->>Admin: Returns list of tickets
    
    Admin->>API: PUT /api/tickets/:id (assign to self)
    API->>DB: UPDATE SupportTickets (admin_id)
    API-->>User: Notification (Ticket is being reviewed)
    
    Admin->>API: PUT /api/tickets/:id (status = resolved)
    API->>DB: UPDATE SupportTickets (status)
    API-->>User: Notification (Ticket resolved)
      `
        }
    ],
    profile: [
        {
            title: 'Real-time Push Notifications',
            description: 'Server pushing notification events to the client via Server-Sent Events (SSE) or WebSockets.',
            code: `
sequenceDiagram
    participant App as External Event (e.g. Booking)
    participant API as Backend
    participant DB as Database
    participant Client as Frontend (SSE/WS)

    Client->>API: Establish persistent connection (SSE/WS)
    API-->>Client: Connection kept alive
    
    App->>API: Event Triggered (target_user_id)
    API->>DB: INSERT INTO Notifications
    API->>API: Check active connections for target_user_id
    
    alt User Connected
        API-->>Client: Push Notification Event (JSON)
        Client->>Client: Display Toast Notification
    end
      `
        },
        {
            title: 'Password Reset Flow',
            description: 'The secure process of requesting a password reset token via email and setting a new password.',
            code: `
sequenceDiagram
    actor User
    participant Client as Frontend
    participant API as Backend
    participant Mail as Email Service (SendGrid)
    participant DB as Database

    User->>Client: Enters email for reset
    Client->>API: POST /api/auth/forgot-password
    API->>API: Generate secure crypto token
    API->>DB: Save Token + Expiry (PasswordResetTokens)
    API->>Mail: Send Reset Email (Token Link)
    Mail-->>User: Delivers Email
    
    User->>Client: Clicks link, enters new password
    Client->>API: POST /api/auth/reset-password (token, new_password)
    API->>DB: Verify token validity & expiry
    DB-->>API: Valid token
    API->>API: Hash new password
    API->>DB: UPDATE Users (hashed_password) & DELETE Token
    API-->>Client: 200 OK (Password changed)
      `
        }
    ],
    reviews: [
        {
            title: 'Post-Stay Review & Owner Reply',
            description: 'A student submitting a review after their lease ends, and the owner providing a public reply.',
            code: `
sequenceDiagram
    actor Student
    actor Owner
    participant API as Backend
    participant DB as Database

    Note over Student, API: Lease has expired
    
    Student->>API: POST /api/reviews (property_id, rating, comment)
    API->>DB: INSERT INTO Reviews
    API-->>Owner: Notification (New Review Received)
    API-->>Student: 201 Created
    
    Owner->>API: POST /api/reviews/:id/reply (comment)
    API->>DB: Check if reply already exists
    alt Reply exists
        API-->>Owner: 400 Error (Only one reply allowed)
    else No reply
        API->>DB: INSERT INTO OwnerReplies
        API-->>Student: Notification (Owner replied to your review)
        API-->>Owner: 201 Created
    end
      `
        }
    ],
    reporting: [
        {
            title: 'User Report & Admin Penalty',
            description: 'A user reporting a violation and an admin reviewing it to apply a penalty.',
            code: `
sequenceDiagram
    actor User
    actor Admin
    participant API as Backend
    participant DB as Database

    User->>API: POST /api/reports (reported_user_id, reason)
    API->>DB: INSERT INTO Reports (status: 'pending')
    API-->>User: 201 Created
    
    Admin->>API: GET /api/reports?status=pending
    API-->>Admin: Returns reports
    
    Admin->>API: POST /api/penalties (target_user_id, 'ban')
    API->>DB: INSERT INTO Penalties
    API->>DB: UPDATE Users SET is_banned = true
    API->>DB: UPDATE Reports SET status = 'reviewed'
    API-->>Admin: 200 OK (Penalty Applied)
      `
        }
    ]
};
