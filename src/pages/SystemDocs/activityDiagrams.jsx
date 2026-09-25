export const diagrams = {
  auth: [
    {
      title: 'User Registration & Verification Flow',
      description: 'The process of a user signing up, submitting verification documents (University ID or Property Permit), and waiting for Admin approval.',
      code: `
flowchart TD
    A[User visits Register Page] --> B[Select Role: Student or Owner]
    B --> C[Enter Details & Password]
    C --> D[Submit Registration Form]
    D --> E[Backend Hashes Password & Saves to DB]
    E --> F[JWT Token Generated & User Logged In]
    
    F --> G{Check Role}
    G -- Student --> H[Redirect to Student Dashboard]
    G -- Owner --> I[Redirect to Owner Dashboard]
    
    H --> J{Is Verified?}
    I --> J
    
    J -- No --> K[Prompt: Upload Verification Document]
    K --> L[User Uploads Doc]
    L --> M[Status changes to Pending Verification]
    
    M --> N((Admin Dashboard: Pending Users))
    N --> O{Admin Reviews Doc}
    
    O -- Approve --> P[Status: Verified]
    P --> Q[Full Platform Access Granted]
    
    O -- Reject --> R[Status: Rejected]
    R --> S[Notification: Re-upload Doc]
    S --> K
    
    J -- Yes --> Q
      `
    }
  ],
  property: [
    {
      title: 'Listing Creation Lifecycle (Owner)',
      description: 'The process of an Owner adding a new boarding house, uploading images, setting prices, and managing its availability status.',
      code: `
flowchart TD
    A[Owner Dashboard] --> B[Click 'Add New Property']
    B --> C[Fill Property Details]
    C --> D[Select Amenities]
    D --> E[Upload Property Images]
    E --> F{Validate Form Data}
    F -- Invalid --> C
    F -- Valid --> G[Submit to Backend]
    G --> H[Save to Database]
    H --> I[Listing Status: Active]
    I --> J[Property Appears in Search Results]
      `
    },
    {
      title: 'Student Search & Filtering',
      description: 'The flow of a student searching for properties, applying filters (price, amenities, distance), using the map view, and saving favorites.',
      code: `
flowchart TD
    A[Student navigates to Search Page] --> B[Enter Keyword/Location]
    B --> C[Apply Filters: Price, Amenities, Distance]
    C --> D[Backend queries Database]
    D --> E{Matching properties?}
    E -- Yes --> F[Display List / Map View of Properties]
    E -- No --> G[Show 'No Results Found' message]
    F --> H[Student clicks a Property]
    H --> I[View Property Details]
    I --> J[Action: Save to Favorites / Request Booking]
      `
    }
  ],
  booking: [
    {
      title: 'The Booking Flow',
      description: 'A student requesting to book a listing, the Owner reviewing the request, and the student being notified.',
      code: `
flowchart TD
    A[Student views Property Details] --> B[Click 'Request to Book']
    B --> C[Select Move-in Date & Duration]
    C --> D[Submit Booking Request]
    D --> E[Status: Pending Owner Approval]
    E --> F((Owner Dashboard))
    F --> G{Owner Reviews Request}
    G -- Approve --> H[Status: Approved / Awaiting Payment]
    H --> I[Notify Student: Booking Accepted]
    G -- Reject --> J[Status: Rejected]
    J --> K[Notify Student: Booking Declined]
      `
    },
    {
      title: 'Digital Lease Signing',
      description: 'The transition of a booking into an active lease, requiring the student to review terms and provide a digital signature.',
      code: `
flowchart TD
    A[Booking Approved & Paid] --> B[Generate Digital Lease Agreement]
    B --> C[Student Receives Lease Notification]
    C --> D[Student Reviews Lease Terms]
    D --> E{Agrees to Terms?}
    E -- No --> F[Contact Owner / Cancel]
    E -- Yes --> G[Student Provides Digital Signature]
    G --> H[Submit Signed Lease]
    H --> I[Owner Receives Signed Lease]
    I --> J[Lease Status: Active]
    J --> K[Move-in Instructions Sent]
      `
    }
  ],
  payments: [
    {
      title: 'Checkout & Webhook Flow (PayHere)',
      description: 'The student initiating a payment, redirection to PayHere, and the backend webhook verifying the cryptographically signed success response to update the ledger.',
      code: `
flowchart TD
    A[Student clicks 'Pay Rent / Deposit'] --> B[Backend generates Payment Hash & Order ID]
    B --> C[Create Pending Payment in DB]
    C --> D[Redirect to PayHere Checkout]
    D --> E{Payment Status}
    
    E -- Cancelled/Failed --> F[Redirect to Error URL]
    F --> G[Student views Payment Failed Page]
    
    E -- Successful --> H[Redirect to Return URL]
    H --> I[Student views Payment Success Page]
    
    D -. Asynchronous Webhook .-> J[PayHere POSTs to Webhook URL]
    J --> K[Backend Verifies Cryptographic Signature]
    K --> L{Signature Valid & Status == 2?}
    
    L -- No --> M[Return 400 Bad Request]
    L -- Yes --> N[Update Payment to 'Completed' in DB]
    N --> O[Update Booking/Ledger Status]
    O --> P[Return 200 OK to PayHere]
      `
    }
  ],
  social: [
    {
      title: 'Roommate Matcher System',
      description: 'The swipe/match logic, handling mutual connections, and initializing a private chat between matched students.',
      code: `
flowchart TD
    A[Student accesses Roommate Matcher] --> B[View Potential Roommate Profile]
    B --> C{Swipe Decision}
    
    C -- Swipe Left (Skip) --> D[Ignore Profile]
    D --> E[Show Next Profile]
    
    C -- Swipe Right (Like) --> F[Record 'Like' in Database]
    F --> G{Did the other user also 'Like'?}
    
    G -- No --> E
    G -- Yes --> H[Create Mutual Match]
    H --> I[Notify Both Students]
    I --> J[Initialize Private Chat Room]
    J --> E
      `
    },
    {
      title: 'Community Forum Moderation',
      description: 'Creating a post, users interacting, and the logic for flagging/moderating abusive content.',
      code: `
flowchart TD
    A[Student creates Forum Post] --> B[Post Published to Community]
    B --> C[Other Users View Post]
    C --> D{User Interaction}
    
    D -- Upvote/Comment --> E[Update Engagement Metrics]
    E --> C
    
    D -- Flag as Inappropriate --> F[Record Flag in DB]
    F --> G{Flag Count > Threshold?}
    
    G -- No --> C
    G -- Yes --> H[Auto-Hide Post]
    H --> I((Admin Dashboard: Reported Content))
    I --> J{Admin Decision}
    
    J -- Safe --> K[Restore Post & Remove Flags]
    J -- Abusive --> L[Delete Post & Warn User]
      `
    }
  ],
  admin: [
    {
      title: 'Support Ticketing System',
      description: 'A user creating a ticket, the ticket appearing in the Admin Dashboard, and the Admin updating statuses.',
      code: `
flowchart TD
    A[User encounters an Issue] --> B[Submit Support Ticket]
    B --> C[Ticket Created in DB: Status 'Open']
    C --> D((Admin Dashboard))
    D --> E[Admin Reviews Ticket]
    E --> F[Admin Assigns/Updates Status to 'In Progress']
    F --> G[Admin Communicates with User]
    G --> H{Issue Resolved?}
    
    H -- No --> G
    H -- Yes --> I[Admin Updates Status to 'Resolved']
    I --> J[Notify User: Ticket Closed]
      `
    },
    {
      title: 'Review Moderation & Broadcasts',
      description: 'The flow of Admins auditing user reviews for spam, managing global system settings, and broadcasting announcements.',
      code: `
flowchart TD
    A[Admin Dashboard] --> B{Action Selection}
    
    B -- Audit Reviews --> C[View Reported/Recent Reviews]
    C --> D{Is Review Spam/Abusive?}
    D -- Yes --> E[Delete Review & Warn User]
    D -- No --> F[Approve/Keep Review]
    
    B -- Manage Settings --> G[Update Global System Configs]
    G --> H[Save Changes to DB]
    
    B -- Broadcasts --> I[Compose Announcement]
    I --> J[Select Target Audience: All, Students, Owners]
    J --> K[Send Broadcast]
    K --> L[Users receive Push/In-App Notification]
      `
    }
  ],
  profile: [
    {
      title: 'Password Reset Flow',
      description: 'The process of a user forgetting their password, receiving an email with a secure token, and updating their credentials.',
      code: `
flowchart TD
    A[User clicks 'Forgot Password'] --> B[Enter Email Address]
    B --> C[Backend verifies Email exists]
    C --> D[Generate Secure Token & Save to DB]
    D --> E[Send Email with Reset Link]
    E --> F[User clicks Link in Email]
    F --> G[Enter New Password]
    G --> H[Submit New Password & Token]
    H --> I[Backend verifies Token]
    I --> J{Token Valid & Not Expired?}
    J -- No --> K[Show Error Message]
    J -- Yes --> L[Update Password in DB & Clear Token]
    L --> M[Notify User & Redirect to Login]
      `
    },
    {
      title: 'Real-time Notifications',
      description: 'The flow of an event triggering a backend process to send a WebSocket or Push event, updating the user interface.',
      code: `
flowchart TD
    A[Event Triggered e.g. New Booking Request] --> B[Backend processes Event]
    B --> C[Save Notification Record in DB]
    C --> D{Is User Online?}
    
    D -- Yes --> E[Send Event via WebSocket/SSE]
    E --> F[Frontend receives Event]
    F --> G[Display Toast Notification]
    G --> H[Update Notification Badge Count]
    
    D -- No --> I[Queue for Push Notification / Email]
    I --> J[Send Push Notification via FCM/Email]
    J --> K[User clicks Notification]
    K --> L[Open App to relevant Screen]
      `
    }
  ],
  reviews: [
    {
      title: 'Post-Lease Review Flow',
      description: 'The process of a student completing a stay, submitting a review, and the owner replying.',
      code: `
flowchart TD
    A[Lease Ends / Stay Completed] --> B[System prompts Student for Review]
    B --> C[Student fills Rating & Text Review]
    C --> D[Submit Review]
    D --> E{Content Moderation Check}
    
    E -- Flagged --> F[Hold for Admin Review]
    E -- Clean --> G[Publish Review to Property Page]
    
    G --> H[Notify Owner]
    H --> I[Owner views Review]
    I --> J{Owner wants to reply?}
    
    J -- No --> K[End]
    J -- Yes --> L[Owner Submits Reply]
    L --> M[Publish Reply under Review]
      `
    }
  ],
  reporting: [
    {
      title: 'Report a Listing/User',
      description: 'The flow of a user reporting suspicious behavior, creating a ticket for admin review and subsequent actions.',
      code: `
flowchart TD
    A[User encounters suspicious Listing/User] --> B[Click 'Report']
    B --> C[Fill Report Form & Attach Evidence]
    C --> D[Submit Report]
    D --> E[Report Ticket created in DB]
    E --> F((Admin Dashboard))
    F --> G[Admin Reviews Report]
    G --> H{Admin Decision}
    
    H -- False Alarm --> I[Dismiss Report & Notify User]
    H -- Violation --> J[Apply Penalty]
    
    J --> K[Suspend Listing / Ban User]
    K --> L[Notify offending party & Reporter]
      `
    }
  ]
};
