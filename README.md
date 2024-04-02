# ReachInbox-MailSenseAI

## Introduction
The tool parses emails from Google and Outlook, categorizes them into "Interested," "Not Interested," or "More Information," then suggests and sends context-based replies. Powered by OAuth, BullMQ, and OpenAI.

## Project Type
 Back End 

## Deplolyed App


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




## Video Walkthrough of the project
Attach a very short video walkthough of all of the features [https://www.loom.com/share/3418f4004b204913a88381fae0abea1f?sid=a348b45b-5d5e-49e6-bdd2-fd8627be7387]

## Features
- user can signup using Google Oauth
- can email to login Oauth from another random email account
- can expect a revert email from these account bases on the email context
- 

## Installation & Getting started
1. **Find the Repository:**
   Go to the GitHub website and locate the repository you want to clone. Copy the repository's URL.

2. **Open Terminal/Command Prompt:**
   Open your terminal or command prompt on your local machine.
      ```bash
   git clone "past the copied link here"

4. **Navigate to the Desired Directory:**
   Use the `cd` command to navigate to the directory where you want to clone the repository. For example:
   ```bash
   cd /path/to/desired-directory

```
```

## Credentials
Provide user credentials for autheticated pages

# Dummy Configuration Data

## Google OAuth Credentials
- **CLIENT_ID**: Create and past here
- **CLIENT_SECRET**: Create and past here
- **REDIRECT_URI**: Create and past here
- **REFRESH_TOKEN**:  Create and past here
- **AUTHORIZTION_CODE**:  Create and past here
- **AUTH_EMAIL**:  Create and past here
- **OPENAI_API_KEY**:  Create and past here

## MySQL Database Configuration
- **HOST**:  Create and past here
- **USER**:  Create and past here
- **PASSWORD**:  Create and past here
- **DATABASE**: Create and past here
- **PORT**:  Create and past here

## Server Configuration
- **PORT**: Create and past here


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

# OpenAI Integration Process

## Step 1: Create an Account on OpenAI Platform
- Go to [OpenAI's signup page](https://platform.openai.com/signup) and create an account.

## Step 2: Obtain API Key
- After creating an account, navigate to the [API keys section](https://platform.openai.com/account/api-keys) in your OpenAI account dashboard.
- Click on "Create new secret key" to generate a new API key.


## APIs Used
[If your application relies on external APIs, document them a](https://gmail.googleapis.com/gmail/v1/users/${emailParam}/messages/${messageIdParam}`;)
[If your application relies on external APIs, document them a](https://gmail.googleapis.com/gmail/v1/users/${email}/threads?maxResults=100`;)

## API Endpoints




## Technology Stack
List and provide a brief overview of the technologies used in the project.

- Node.js
- Express.js
- MySQL
- CronJob,
- OpenAI
