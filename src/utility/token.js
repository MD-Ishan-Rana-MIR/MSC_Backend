import jwt from "jsonwebtoken";

export const generateToken = (payload, key, time) => {
    try {
        const token = jwt.sign(payload, key, { expiresIn: time });
        return token;
    } catch (error) {
        console.error("JWT generation error:", error);
        return null;
    }
};