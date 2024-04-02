# ReachInbox-MailSenseAI

## Introduction
ReachInbox-MailSenseAI is a powerful backend tool designed to parse emails from Google and Outlook, categorize them into "Interested," "Not Interested," or "More Information," and suggest context-based replies. Leveraging OAuth for authentication, CronJob for task scheduling and OpenAI for advanced natural language processing capabilities, this tool streamlines email management and enhances user productivity.

## Project Type
Backend

## Deployed App
N/A

## Directory Structure

# Directory Structure
```bash
ReachInbox/
|-- node_modules/
|-- src/
|   |-- config/
|   |-- controller/
|   |-- model/
|   |-- route/
|   |-- utils/
|   `-- index.ts
|-- .env
|-- .gitignore
|-- package.json
|-- package-lock.json
`-- tsconfig.json
```

## Video Walkthrough
[Watch the video walkthrough here](https://www.loom.com/share/3418f4004b204913a88381fae0abea1f?sid=a348b45b-5d5e-49e6-bdd2-fd8627be7387)

## Features
- **Google OAuth Integration:** Users can seamlessly sign up and log in using their Google accounts, enhancing security and convenience.
- **Email Parsing and Categorization:** The tool intelligently parses incoming emails from Google and Outlook, categorizing them into predefined categories for efficient management.
- **Context-Based Replies:** Utilizing OpenAI's natural language processing capabilities, the tool suggests context-based replies tailored to the content of the received emails.
- **Scalable Architecture:** Built with BullMQ for message queueing, ensuring scalability and reliability in processing a large volume of emails.

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
   - Configure the necessary credentials in the provided `.env` file.

5. **Run the Application:**
   - Execute: `npm start` to run the application.

## Credentials
Securely configure user credentials for authenticated pages.

### Dummy Configuration Data

#### Google OAuth Credentials
- **CLIENT_ID**: Your Google OAuth client ID.
- **CLIENT_SECRET**: Your Google OAuth client secret.
- **REDIRECT_URI**: Your OAuth redirect URI.
- **REFRESH_TOKEN**: Your OAuth refresh token.
- **AUTHORIZATION_CODE**: Your OAuth authorization code.
- **AUTH_EMAIL**: Your OAuth authorized email.
- **OPENAI_API_KEY**: Your OpenAI API key.

#### MySQL Database Configuration
- **HOST**: Database host.
- **USER**: Database user.
- **PASSWORD**: Database password.
- **DATABASE**: Database name.
- **PORT**: Database port.

#### Server Configuration
- **PORT**: Server port.

## Google OAuth
Google OAuth (Open Authorization) is an authentication protocol that enables users to securely access third-party applications without revealing their credentials. It allows users to grant limited access to their Google account data to other applications while maintaining control over their privacy.

### How it Works
1. **Authorization Request:** Users are redirected to Google's authorization server to grant access to their data.
2. **User Consent:** Users authenticate and authorize the application to access specific data or perform actions on their behalf.
3. **Access Token Issuance:** Google's authorization server issues an access token to the application, enabling it to access the user's data.
4. **Data Access:** With the access token, the application can make API requests to Google services on behalf of the user.

### Benefits
- Enhanced Security
- User Privacy
- Simplified Integration

### Use Cases
- Single Sign-On (SSO)
- Third-Party Integrations

## OpenAI Integration Process
1. **Create an Account:** Sign up for an account on the OpenAI platform.
2. **Obtain API Key:** Generate an API key from the API keys section in your OpenAI account dashboard.

## APIs Used
- `https://gmail.googleapis.com/gmail/v1/users/${emailParam}/messages/${messageIdParam}`
- `https://gmail.googleapis.com/gmail/v1/users/${email}/threads?maxResults=100`

## Technology Stack
- **Node.js:** JavaScript runtime for building scalable network applications.
- **Express.js:** Web application framework for Node.js.
- **MySQL:** Relational database management system for data storage and retrieval.
- **BullMQ:** Advanced message queueing library for handling asynchronous tasks.
- **OpenAI:** Platform for advanced natural language processing and machine learning models.

