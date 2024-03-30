import dotenv from 'dotenv';
dotenv.config();

const auth = {
    type: 'OAuth2',
    user: 'raorajan9576@gmail.com',
    clientId: process.env.CLIENT_ID as string,
    clientSecret: process.env.CLIENT_SECRET as string,
    refreshToken: process.env.REFRESH_TOKEN as string,
};

const mailOptions = {    
    to: 'shrikishunr7@gmail.com',
    from: 'raorajan9576@gmail.com',
    subject: 'Gmail API using Node JS',
};

export { auth, mailOptions };
