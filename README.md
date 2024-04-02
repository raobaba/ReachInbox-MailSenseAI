# ReachInbox-MailSenseAI

## Introduction
The tool parses emails from Google and Outlook, categorizes them into "Interested," "Not Interested," or "More Information," then suggests and sends context-based replies. Powered by OAuth, BullMQ, and OpenAI.

## Project Type
Back End

## Deployed App
N/A

## Directory Structure



## Directory Structure
- ReachInbox
  - node_modules
  - src
    - config
    - controller
    - model
    - route
    - utils
    - index.ts
  - .env
  - .gitignore
  - package.json
  - package-lock.json
  - tsconfig.json





## Video Walkthrough of the Project
[Watch the video walkthrough here](https://www.loom.com/share/3418f4004b204913a88381fae0abea1f?sid=a348b45b-5d5e-49e6-bdd2-fd8627be7387)

## Features
- User can signup using Google OAuth.
- Can email to login OAuth from another random email account.
- Can expect a revert email from these accounts based on the email context.

## Installation & Getting Started
1. **Clone the Repository:**
   - Copy the repository's URL from GitHub.
   - Open Terminal/Command Prompt.
   - Execute: `git clone <repository_URL>`.
   
2. **Navigate to the Directory:**
   - Use `cd` to navigate to the cloned directory.

3. **Install Dependencies:**
   - Execute: `npm install` to install required dependencies.

4. **Set up Credentials:**
   - Refer to the provided `.env` file for necessary credentials.
   - Ensure all required credentials are properly set up.

5. **Run the Application:**
   - Execute: `npm start` to run the application.

## Credentials
Provide user credentials for authenticated pages.

### Dummy Configuration Data

#### Google OAuth Credentials
- **CLIENT_ID**: Create and paste here.
- **CLIENT_SECRET**: Create and paste here.
- **REDIRECT_URI**: Create and paste here.
- **REFRESH_TOKEN**: Create and paste here.
- **AUTHORIZTION_CODE**: Create and paste here.
- **AUTH_EMAIL**: Create and paste here.
- **OPENAI_API_KEY**: Create and paste here.

#### MySQL Database Configuration
- **HOST**: Create and paste here.
- **USER**: Create and paste here.
- **PASSWORD**: Create and paste here.
- **DATABASE**: Create and paste here.
- **PORT**: Create and paste here.

#### Server Configuration
- **PORT**: Create and paste here.

## Google OAuth
Google OAuth (Open Authorization) is an authentication protocol that allows users to securely access third-party applications or websites without revealing their credentials. It enables users to grant limited access to their Google account data to other applications, such as web or mobile apps, while maintaining control over their privacy.

### How it Works
1. **Authorization Request:**
   When a user tries to access a service requiring Google OAuth, they are redirected to Google's authorization server to grant access to their data.
   
2. **User Consent:**
   The user is prompted to authenticate themselves and then authorize the application to access specific data or perform actions on their behalf.
   
3. **Access Token Issuance:**
   After the user grants consent, Google's authorization server issues an access token to the application. This token acts as a credential that the application can use to access the user's data.
   
4. **Data Access:**
   With the access token, the application can make API requests to Google services on behalf of the user, accessing the authorized data or performing authorized actions.

### Benefits
- **Enhanced Security:** Users don't need to share their Google credentials with third-party applications, reducing the risk of unauthorized access.
- **User Privacy:** Users have control over which data they share with each application and can revoke access at any time.
- **Simplified Integration:** Developers can leverage Google OAuth for seamless authentication and data access in their applications, reducing development time and effort.

### Use Cases
- **Single Sign-On (SSO):** Users can log in to multiple services using their Google account credentials, eliminating the need for separate login credentials for each service.
- **Third-Party Integrations:** Developers can integrate Google OAuth into their applications to access various Google services, such as Gmail, Google Drive, and Google Calendar, on behalf of users.

Google OAuth is widely adopted across the web and mobile applications, providing a secure and convenient authentication mechanism for users.

## OpenAI Integration Process

### Step 1: Create an Account on OpenAI Platform
- Go to [OpenAI's signup page](https://platform.openai.com/signup) and create an account.

### Step 2: Obtain API Key
- After creating an account, navigate to the [API keys section](https://platform.openai.com/account/api-keys) in your OpenAI account dashboard.
- Click on "Create new secret key" to generate a new API key.

## APIs Used
- `https://gmail.googleapis.com/gmail/v1/users/${emailParam}/messages/${messageIdParam}`
- `https://gmail.googleapis.com/gmail/v1/users/${email}/threads?maxResults=100`

## API Endpoints
N/A

## Technology Stack
List and provide a brief overview of the technologies used in the project.

- Node.js: JavaScript runtime for building server-side applications.
- Express.js: Web application framework for Node.js.
- MySQL: Relational database management system for storing and retrieving data.
- CronJob: Library for scheduling tasks in Node.js.
- OpenAI: Platform for AI-powered applications and services.
