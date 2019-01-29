// i think setting these to env variables
// accessed with process.env makes the most
// sense
require('dotenv').config()

module.exports = {
    'secret': process.env.SECRET,
    'mongodb': process.env.MONGO_URL,
    'fromEmail':  process.env.FROM_EMAIL,
    'JWTsecret':  process.env.JWT_SECRET,
    'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID,
    'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET,
    'AWSACCESSKEYID': process.env.AWSACCESSKEYID,
    'AWSSECRETACCESSKEY': process.env.AWSSECRETACCESSKEY,
    'AWSS3BUCKET': process.env.AWSS3BUCKET,
    'STRAVA_CLIENT_ID': process.env.STRAVA_CLIENT_ID,
    'STRAVA_CLIENT_SECRET': process.env.STRAVA_CLIENT_SECRET,
};
