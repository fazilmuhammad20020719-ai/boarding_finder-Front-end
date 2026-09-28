export const erDiagrams = {
  auth: [
    {
      title: 'User Authentication & Verification Entities',
      description: 'The core Users table linked to their Verification Documents and Password Reset Tokens.',
      code: `
erDiagram
    Users ||--o{ VerificationDocuments : "Submits"
    Users ||--o{ VerificationDocuments : "Verifies (Admin)"
    Users ||--o{ PasswordResetTokens : "Requests"

    Users {
        UUID id PK
        VARCHAR email
        VARCHAR password_hash
        ENUM role
        BOOLEAN is_verified
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    VerificationDocuments {
        UUID id PK
        UUID user_id FK
        ENUM doc_type
        VARCHAR doc_url
        ENUM verification_status
        TEXT rejection_note
        TIMESTAMP uploaded_at
        UUID verified_by FK
        TIMESTAMP verified_at
    }
    PasswordResetTokens {
        UUID id PK
        UUID user_id FK
        VARCHAR token
        TIMESTAMP expires_at
        TIMESTAMP created_at
    }
      `
    }
  ],
  property: [
    {
      title: 'Property Listing & Search Entities',
      description: 'The core Properties table linked to Amenities, Images, and user Favorites.',
      code: `
erDiagram
    Users ||--o{ Properties : "Owns (Owner)"
    Users ||--o{ Favorites : "Saves (Student)"
    Properties ||--o{ Favorites : "Is Saved In"
    Properties ||--o{ Amenities : "Has"
    Properties ||--o{ PropertyImages : "Displays"

    Users {
        UUID id PK
    }
    Properties {
        UUID id PK
        UUID owner_id FK
        VARCHAR title
        DECIMAL price
        VARCHAR location
        TEXT description
        ENUM status "'active', 'inactive'"
        TIMESTAMP created_at
    }
    Amenities {
        UUID id PK
        UUID property_id FK
        VARCHAR name
    }
    PropertyImages {
        UUID id PK
        UUID property_id FK
        VARCHAR image_url
        BOOLEAN is_primary
    }
    Favorites {
        UUID id PK
        UUID student_id FK
        UUID property_id FK
        TIMESTAMP created_at
    }
      `
    }
  ],
  booking: [
    {
      title: 'Booking & Digital Leasing Entities',
      description: 'The flow from a Booking request between a Student and Owner, escalating into a signed Lease agreement.',
      code: `
erDiagram
    Users ||--o{ Bookings : "Requests (Student)"
    Users ||--o{ Bookings : "Receives (Owner)"
    Properties ||--o{ Bookings : "Has"
    Bookings ||--|| Leases : "Generates"

    Users {
        UUID id PK
    }
    Properties {
        UUID id PK
    }
    Bookings {
        UUID id PK
        UUID student_id FK
        UUID owner_id FK
        UUID property_id FK
        DATE start_date
        DATE end_date
        ENUM status "'pending', 'approved', 'rejected'"
        TIMESTAMP created_at
    }
    Leases {
        UUID id PK
        UUID booking_id FK
        TEXT lease_terms
        VARCHAR student_signature
        VARCHAR owner_signature
        ENUM status "'active', 'terminated', 'expired'"
        TIMESTAMP created_at
    }
      `
    }
  ],
  payments: [
    {
      title: 'Payments & Transactions Entities',
      description: 'Records of PayHere transactions and recurring monthly ledgers/invoices.',
      code: `
erDiagram
    Users ||--o{ Payments : "Makes (Student)"
    Bookings ||--o{ Payments : "Has"
    Leases ||--o{ Payments : "Has"
    Leases ||--o{ Invoices : "Generates"
    Users ||--o{ Invoices : "Is Billed"
    Invoices ||--o{ Payments : "Settled By"

    Users {
        UUID id PK
    }
    Bookings {
        UUID id PK
    }
    Leases {
        UUID id PK
    }
    Payments {
        UUID id PK
        UUID payer_id FK
        UUID booking_id FK
        UUID lease_id FK
        UUID invoice_id FK
        DECIMAL amount
        VARCHAR payhere_order_id
        ENUM status "'pending', 'completed', 'failed'"
        VARCHAR cryptohash
        TIMESTAMP created_at
    }
    Invoices {
        UUID id PK
        UUID lease_id FK
        UUID payer_id FK
        ENUM type "'rent', 'deposit', 'fee'"
        DECIMAL amount
        DATE due_date
        ENUM status "'unpaid', 'paid', 'overdue'"
        TIMESTAMP created_at
    }
      `
    }
  ],
  social: [
    {
      title: 'Social & Community Entities',
      description: 'Roommate matching systems, private messaging, and community forums.',
      code: `
erDiagram
    Users ||--|| RoommateProfiles : "Creates"
    Users ||--o{ Swipes : "Makes"
    Users ||--o{ Matches : "Forms"
    Matches ||--|| ChatRooms : "Initializes"
    ChatRooms ||--o{ Messages : "Contains"
    Users ||--o{ Messages : "Sends"
    Users ||--o{ ForumPosts : "Authors"
    ForumPosts ||--o{ ForumComments : "Has"
    Users ||--o{ ForumComments : "Authors"

    Users {
        UUID id PK
    }
    RoommateProfiles {
        UUID id PK
        UUID user_id FK
        TEXT bio
        TEXT habits
        TEXT preferences
    }
    Swipes {
        UUID id PK
        UUID swiper_id FK
        UUID swiped_id FK
        ENUM direction "'left', 'right'"
        TIMESTAMP created_at
    }
    Matches {
        UUID id PK
        UUID user1_id FK
        UUID user2_id FK
        TIMESTAMP created_at
    }
    ChatRooms {
        UUID id PK
        UUID match_id FK
        TIMESTAMP created_at
    }
    Messages {
        UUID id PK
        UUID chat_room_id FK
        UUID sender_id FK
        TEXT content
        TIMESTAMP sent_at
    }
    ForumPosts {
        UUID id PK
        UUID author_id FK
        VARCHAR title
        TEXT content
        INT upvotes
        TIMESTAMP created_at
    }
    ForumComments {
        UUID id PK
        UUID post_id FK
        UUID author_id FK
        TEXT content
        TIMESTAMP created_at
    }
      `
    }
  ],
  admin: [
    {
      title: 'Admin & Support Operations Entities',
      description: 'Support tickets, platform-wide broadcasts, and global configuration settings.',
      code: `
erDiagram
    Users ||--o{ SupportTickets : "Submits"
    Users ||--o{ SupportTickets : "Resolves (Admin)"
    Users ||--o{ Broadcasts : "Sends (Admin)"
    Users ||--o{ GlobalSettings : "Manages (Admin)"

    Users {
        UUID id PK
    }
    SupportTickets {
        UUID id PK
        UUID user_id FK
        UUID admin_id FK
        VARCHAR subject
        TEXT description
        ENUM status "'open', 'in_progress', 'resolved'"
        TIMESTAMP created_at
        TIMESTAMP resolved_at
    }
    Broadcasts {
        UUID id PK
        UUID admin_id FK
        VARCHAR title
        TEXT message
        ENUM target_audience "'all', 'students', 'owners'"
        TIMESTAMP sent_at
    }
    GlobalSettings {
        UUID id PK
        VARCHAR key
        TEXT value
        UUID updated_by FK
        TIMESTAMP updated_at
    }
      `
    }
  ],
  profile: [
    {
      title: 'User Profile & Notifications Entities',
      description: 'Extended user profiles, account recovery tokens, and real-time app notifications.',
      code: `
erDiagram
    Users ||--|| UserProfiles : "Has"
    Users ||--o{ Notifications : "Receives"
    Users ||--o{ PasswordResetTokens : "Requests"

    Users {
        UUID id PK
    }
    UserProfiles {
        UUID id PK
        UUID user_id FK
        VARCHAR profile_picture_url
        VARCHAR phone_number
        TEXT address
        TIMESTAMP updated_at
    }
    Notifications {
        UUID id PK
        UUID user_id FK
        VARCHAR title
        TEXT message
        ENUM type "'booking', 'message', 'system'"
        BOOLEAN is_read
        TIMESTAMP created_at
    }
    PasswordResetTokens {
        UUID id PK
        UUID user_id FK
        VARCHAR token
        TIMESTAMP expires_at
        TIMESTAMP created_at
    }
      `
    }
  ],
  reviews: [
    {
      title: 'Reviews & Ratings Entities',
      description: 'Post-stay student reviews and owner replies.',
      code: `
erDiagram
    Users ||--o{ Reviews : "Writes (Student)"
    Properties ||--o{ Reviews : "Receives"
    Reviews ||--|| OwnerReplies : "Has"
    Users ||--o{ OwnerReplies : "Writes (Owner)"

    Users {
        UUID id PK
    }
    Properties {
        UUID id PK
    }
    Reviews {
        UUID id PK
        UUID student_id FK
        UUID property_id FK
        INT rating
        TEXT comment
        TIMESTAMP created_at
    }
    OwnerReplies {
        UUID id PK
        UUID review_id FK
        UUID owner_id FK
        TEXT comment
        TIMESTAMP created_at
    }
      `
    }
  ],
  reporting: [
    {
      title: 'Reporting & Safety Entities',
      description: 'Records of user reports against listings/users and admin-applied penalties.',
      code: `
erDiagram
    Users ||--o{ Reports : "Submits (Reporter)"
    Users ||--o{ Reports : "Receives (Reported User)"
    Properties ||--o{ Reports : "Receives (Reported Property)"
    Users ||--o{ Penalties : "Applies (Admin)"
    Users ||--o{ Penalties : "Receives (Target User)"
    Properties ||--o{ Penalties : "Receives (Target Property)"

    Users {
        UUID id PK
    }
    Properties {
        UUID id PK
    }
    Reports {
        UUID id PK
        UUID reporter_id FK
        UUID reported_user_id FK
        UUID reported_property_id FK
        VARCHAR reason
        VARCHAR evidence_url
        ENUM status "'pending', 'reviewed', 'dismissed'"
        TIMESTAMP created_at
    }
    Penalties {
        UUID id PK
        UUID admin_id FK
        UUID target_user_id FK
        UUID target_property_id FK
        ENUM penalty_type "'warning', 'suspension', 'ban'"
        INT duration_days
        TEXT reason
        TIMESTAMP applied_at
    }
      `
    }
  ]
};
