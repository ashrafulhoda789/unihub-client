import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db('unihub_db');

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        
        client
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "student",
                input: true,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const chosenRole = user.requestedRole === "faculty" ? "faculty" : "student";

                    return {
                        data: {
                            ...user,
                            role: chosenRole,
                        },
                    };
                },
            },
        },
    },
    plugins: [
        admin({
            defaultRole: 'student'
        })
    ]
});