
export const EnvConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    mongo_url: process.env.MONGO_URL,
    port: process.env.PORT || 3001,
    default_limit: +process.env.DEFAULT_LIMIT || 10,
})