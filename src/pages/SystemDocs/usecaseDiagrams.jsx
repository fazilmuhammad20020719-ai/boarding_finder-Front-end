export const usecaseDiagrams = {
    auth: [
        {
            title: 'Detailed Authentication & Onboarding Use Cases',
            description: 'Comprehensive flows for role-based registration, secure login with 2FA, password recovery, and KYC verification.',
            code: `
flowchart LR
    %% Actors
    Guest[Unregistered Guest]
    User[Registered User]
    Sys[Auth System]
    Admin[Administrator]

    %% Use Cases
    subgraph Authentication & Onboarding Operations
        %% Registration
        UC1([Register Account])
        UC1a([Select Role: Student/Owner])
        UC1b([Send Verification Email])
        
        %% Login
        UC2([Login])
        UC2a([Verify Credentials])
        UC2b([Trigger 2FA / OTP])
        
        %% Password Management
        UC3([Reset Password])
        UC3a([Send Reset Link])
        
        %% KYC & Verification
        UC4([Complete Profile Setup])
        UC5([Upload KYC Documents])
        UC6([Verify KYC Docs])
    end

    %% Guest Relationships
    Guest --> UC1
    Guest --> UC2
    Guest --> UC3
    
    %% User Relationships
    User --> UC4
    User --> UC5
    
    %% System Relationships
    Sys --> UC1b
    Sys --> UC2a
    Sys --> UC2b
    Sys --> UC3a
    
    %% Admin Relationships
    Admin --> UC6

    %% Include / Extend Logic
    UC1 -.->|<<includes>>| UC1a
    UC1 -.->|<<triggers>>| UC1b
    
    UC2 -.->|<<triggers>>| UC2a
    UC2a -.->|<<extends>>| UC2b
    
    UC3 -.->|<<triggers>>| UC3a
    
    UC4 -.->|<<extends>>| UC5
    UC5 -.->|<<triggers>>| UC6
      `
        }
    ],
    property: [
        {
            title: 'Detailed Property Listing & Search Use Cases',
            description: 'Granular interactions covering listing creation, map-based search, dynamic filtering, and system indexing.',
            code: `
flowchart LR
    %% Actors
    Student[Student]
    Owner[Property Owner]
    Sys[System / Search Engine]

    %% Use Cases
    subgraph Property Listing & Search Operations
        %% Owner Actions
        UC1([Create Property Listing])
        UC1a([Upload Images])
        UC1b([Set Location on Map])
        UC1c([Define Amenities & Rules])
        
        UC2([Edit Listing])
        UC2a([Update Availability Status])
        
        UC3([Deactivate/Delete Listing])
        
        %% Student Actions
        UC4([Search Properties])
        UC4a([Apply Filters: Price/Distance])
        UC4b([View on Interactive Map])
        
        UC5([View Property Details])
        UC5a([View Image Gallery])
        UC5b([Check Reviews & Ratings])
        
        %% System Action
        UC6([Auto-Index for Search])
    end

    %% Owner Relationships
    Owner --> UC1
    Owner --> UC2
    Owner --> UC3
    
    %% Student Relationships
    Student --> UC4
    Student --> UC5
    
    %% System Relationships
    Sys --> UC6

    %% Include / Extend Logic for Owner
    UC1 -.->|<<includes>>| UC1a
    UC1 -.->|<<includes>>| UC1b
    UC1 -.->|<<includes>>| UC1c
    UC1 -.->|<<triggers>>| UC6
    
    UC2 -.->|<<extends>>| UC2a
    UC2a -.->|<<triggers>>| UC6
    
    %% Include / Extend Logic for Student
    UC4 -.->|<<extends>>| UC4a
    UC4 -.->|<<extends>>| UC4b
    
    UC4 -.->|<<includes>>| UC5
    
    UC5 -.->|<<includes>>| UC5a
    UC5 -.->|<<includes>>| UC5b
      `
        }
    ],
    booking: [
        {
            title: 'Detailed Booking & Digital Leasing Use Cases',
            description: 'Comprehensive interactions covering booking requests, granular approvals, system automation, and lease execution.',
            code: `
flowchart LR
    %% Actors
    Student[Student]
    Owner[Property Owner]
    Sys[System / Automation]

    %% Use Cases
    subgraph Booking & Leasing Operations
        %% Booking Phase
        UC1([Request Booking])
        UC1a([Select Dates])
        UC1b([Send Inquiry Message])
        UC2([Cancel Pending Request])
        
        UC3([Review Booking Request])
        UC3a([Approve Booking])
        UC3b([Reject Booking])
        
        %% Leasing Phase
        UC4([Auto-Generate Lease PDF])
        UC5([Review Lease Terms])
        UC6([Digitally Sign Lease])
        UC7([Pay Security Deposit])
        
        %% Management
        UC8([Cancel Active Booking])
    end

    %% Student Relationships
    Student --> UC1
    Student --> UC2
    Student --> UC5
    Student --> UC6
    Student --> UC7
    Student --> UC8

    %% Owner Relationships
    Owner --> UC3
    Owner --> UC6
    Owner --> UC8
    
    %% System Actions
    Sys --> UC4

    %% Include / Extend Logic
    UC1 -.->|<<includes>>| UC1a
    UC1 -.->|<<includes>>| UC1b
    
    UC3 -.->|<<extends>>| UC3a
    UC3 -.->|<<extends>>| UC3b
    
    UC3a -.->|<<triggers>>| UC4
    
    UC6 -.->|<<includes>>| UC5
    UC7 -.->|<<extends>>| UC6
      `
        }
    ],
    payments: [
        {
            title: 'Detailed Payments & Transactions Use Cases',
            description: 'Advanced financial flows including secure processing, automated invoicing, webhook confirmations, and payouts.',
            code: `
flowchart LR
    %% Actors
    Student[Student]
    Owner[Property Owner]
    Sys[Internal System]
    PayHere[PayHere Gateway]

    %% Use Cases
    subgraph Payments & Transactions Operations
        %% Payment Actions
        UC1([Initiate Payment])
        UC1a([Select Payment Method])
        UC1b([Process Transaction securely])
        UC1c([Send Webhook Confirmation])
        
        UC2([View Transaction History])
        UC2a([Download PDF Receipt])
        
        UC3([Generate Automated Invoice])
        UC4([Issue Refund])
        
        UC5([Payout to Owner])
    end

    %% Student Relationships
    Student --> UC1
    Student --> UC2
    
    %% Owner Relationships
    Owner --> UC2
    Owner --> UC4
    Owner --> UC5
    
    %% Gateway Relationships
    PayHere --> UC1b
    PayHere --> UC1c
    
    %% System Relationships
    Sys --> UC3
    Sys --> UC5

    %% Include / Extend Logic
    UC1 -.->|<<includes>>| UC1a
    UC1 -.->|<<triggers>>| UC1b
    UC1b -.->|<<triggers>>| UC1c
    UC1c -.->|<<triggers>>| UC3
    
    UC2 -.->|<<extends>>| UC2a
      `
        }
    ],
    social: [
        {
            title: 'Detailed Social & Community Use Cases',
            description: 'Comprehensive interactions for roommate matchmaking, messaging, forum engagement, and user moderation.',
            code: `
flowchart LR
    %% Actors
    StudentA[Student A]
    StudentB[Student B]
    Sys[System / Match Engine]

    %% Use Cases
    subgraph Social & Community Operations
        %% Roommate Matching
        UC1([Swipe on Profiles])
        UC1a([View Roommate Preferences])
        UC2([Record Swipe Right])
        UC3([Trigger Match Notification])
        
        %% Messaging
        UC4([Send Real-Time Message])
        UC4a([Attach Image/File])
        UC5([View Chat History])
        
        %% Community Forum
        UC6([Create Forum Post])
        UC6a([Reply to Post])
        UC6b([Upvote Post])
        
        %% Moderation (Student level)
        UC7([Block User])
        UC8([Report Inappropriate Message])
    end

    %% Student Relationships
    StudentA --> UC1
    StudentA --> UC4
    StudentA --> UC5
    StudentA --> UC6
    StudentA --> UC7
    StudentA --> UC8
    
    StudentB --> UC1
    StudentB --> UC4
    
    %% System Relationships
    Sys --> UC3

    %% Include / Extend Logic
    UC1 -.->|<<includes>>| UC1a
    UC1 -.->|<<triggers>>| UC2
    UC2 -.->|<<triggers>>| UC3
    
    UC4 -.->|<<extends>>| UC4a
    
    UC6 -.->|<<extends>>| UC6a
    UC6 -.->|<<extends>>| UC6b
      `
        }
    ],
    admin: [
        {
            title: 'Detailed Admin & Support Use Cases',
            description: 'System interactions for robust ticket routing, user moderation, document verification, and global broadcasting.',
            code: `
flowchart LR
    %% Actors
    User[Registered User]
    Admin[Administrator]
    Sys[Routing System]

    %% Use Cases
    subgraph Admin & Support Operations
        %% Ticket Creation (User Side)
        UC1([Create Support Ticket])
        UC1a([Select Issue Category])
        UC1b([Attach Evidence/Screenshots])
        
        %% Ticket Routing (System)
        UC2([Auto-Route to Department])
        
        %% Ticket Management (Admin Side)
        UC3([Manage Tickets])
        UC3a([Assign Ticket])
        UC3b([Escalate Ticket])
        UC3c([Resolve & Close Ticket])
        
        %% Content & User Moderation
        UC4([Manage Users & Content])
        UC4a([Review Flagged Content])
        UC4b([Verify KYC Documents])
        UC4c([Apply Sanctions / Bans])
        
        %% Global Comms
        UC5([Manage Communications])
        UC5a([Send System Broadcast])
    end

    %% User Relationships
    User --> UC1
    
    %% System Relationships
    Sys --> UC2
    
    %% Admin Relationships
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5

    %% Include / Extend Logic
    UC1 -.->|<<includes>>| UC1a
    UC1 -.->|<<includes>>| UC1b
    UC1 -.->|<<triggers>>| UC2
    
    UC3 -.->|<<extends>>| UC3a
    UC3 -.->|<<extends>>| UC3b
    UC3 -.->|<<extends>>| UC3c
    
    UC4 -.->|<<extends>>| UC4a
    UC4 -.->|<<extends>>| UC4b
    UC4 -.->|<<extends>>| UC4c
    
    UC5 -.->|<<extends>>| UC5a
      `
        }
    ],
    profile: [
        {
            title: 'Detailed Profile & Notifications Use Cases',
            description: 'Granular user interactions for account management, security settings, and real-time notification feeds.',
            code: `
flowchart LR
    %% Actors
    User[User]
    Sys[Notification System]

    %% Use Cases
    subgraph Profile & Notifications Operations
        %% Profile Management
        UC1([Manage Profile])
        UC1a([Update Bio & Details])
        UC1b([Change Avatar])
        UC1c([Update Preferences])
        
        %% Authentication/Security settings
        UC2([Manage Account Security])
        UC2a([Change Password])
        UC2b([Manage Devices/Sessions])
        
        %% Notifications
        UC3([Manage Notifications])
        UC3a([View Notification Feed])
        UC3b([Mark as Read/Unread])
        UC3c([Clear All Notifications])
        
        %% System Triggered
        UC4([Receive Real-time Alert])
    end

    %% User Relationships
    User --> UC1
    User --> UC2
    User --> UC3
    
    %% System Relationships
    Sys --> UC4

    %% Include / Extend Logic
    UC1 -.->|<<extends>>| UC1a
    UC1 -.->|<<extends>>| UC1b
    UC1 -.->|<<extends>>| UC1c
    
    UC2 -.->|<<extends>>| UC2a
    UC2 -.->|<<extends>>| UC2b
    
    UC3 -.->|<<extends>>| UC3a
    UC3 -.->|<<extends>>| UC3b
    UC3 -.->|<<extends>>| UC3c
    
    UC4 -.->|<<triggers>>| UC3a
      `
        }
    ],
    reviews: [
        {
            title: 'Detailed Reviews & Ratings Use Cases',
            description: 'Granular flow for student feedback submission, owner public replies, and admin moderation of flagged content.',
            code: `
flowchart LR
    %% Actors
    Student[Student]
    Owner[Property Owner]
    Admin[Administrator]

    %% Use Cases
    subgraph Reviews & Ratings Operations
        %% Review Creation (Student Side)
        UC1([Submit Property Review])
        UC1a([Rate 1-5 Stars])
        UC1b([Write Text Feedback])
        UC1c([Attach Photos])
        
        %% Owner Response
        UC2([Manage Reviews])
        UC2a([Post Public Reply])
        
        %% Moderation
        UC3([Report Review])
        UC4([Moderate Flagged Review])
        UC4a([Remove Review])
        UC4b([Dismiss Report])
    end

    %% Student Relationships
    Student --> UC1
    Student --> UC3
    
    %% Owner Relationships
    Owner --> UC2
    Owner --> UC3
    
    %% Admin Relationships
    Admin --> UC4

    %% Include / Extend Logic
    UC1 -.->|<<includes>>| UC1a
    UC1 -.->|<<includes>>| UC1b
    UC1 -.->|<<extends>>| UC1c
    
    UC2 -.->|<<extends>>| UC2a
    
    UC3 -.->|<<triggers>>| UC4
    UC4 -.->|<<extends>>| UC4a
    UC4 -.->|<<extends>>| UC4b
      `
        }
    ],
    reporting: [
        {
            title: 'Detailed Reporting & Safety Use Cases',
            description: 'Comprehensive interactions for manual reporting, automated safety triggers, admin moderation, and disciplinary actions.',
            code: `
flowchart LR
    %% Actors
    User[User]
    Admin[Administrator]
    Sys[Automated Safety System]

    %% Use Cases
    subgraph Reporting & Safety Operations
        %% Reporting
        UC1([Submit Report])
        UC1a([Flag Inappropriate Property])
        UC1b([Report Abusive User])
        
        %% Automated Safety
        UC2([Auto-Flag Suspicious Activity])
        UC3([Generate Safety Alert])
        
        %% Admin Moderation
        UC4([Investigate Report])
        UC4a([Request Additional Context])
        UC4b([Dismiss Report])
        
        %% Disciplinary Actions
        UC5([Apply Disciplinary Action])
        UC5a([Issue Official Warning])
        UC5b([Temporary Suspension])
        UC5c([Permanent Ban])
    end

    %% User Relationships
    User --> UC1
    
    %% System Relationships
    Sys --> UC2
    
    %% Admin Relationships
    Admin --> UC4
    Admin --> UC5

    %% Include / Extend Logic
    UC1 -.->|<<extends>>| UC1a
    UC1 -.->|<<extends>>| UC1b
    
    UC2 -.->|<<triggers>>| UC3
    UC3 -.->|<<triggers>>| UC4
    UC1 -.->|<<triggers>>| UC4
    
    UC4 -.->|<<extends>>| UC4a
    UC4 -.->|<<extends>>| UC4b
    UC4 -.->|<<triggers>>| UC5
    
    UC5 -.->|<<extends>>| UC5a
    UC5 -.->|<<extends>>| UC5b
    UC5 -.->|<<extends>>| UC5c
      `
        }
    ]
};
