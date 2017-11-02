// i think setting these to env variables
// accessed with process.env makes the most
// sense
require('dotenv').config()

module.exports = {
    'secret': 'bananaramalamwilliamvalderama',
    'mongodb': '127.0.0.1/bikeindustryjobs',
    'JWTsecret': 'whoputthebompinthebompdabompdabomp',
    'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID,
    'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET,
    'AWSACCESSKEYID': process.env.AWSACCESSKEYID,
    'AWSSECRETACCESSKEY': process.env.AWSSECRETACCESSKEY,
    'AWSS3BUCKET': process.env.AWSS3BUCKET,
};