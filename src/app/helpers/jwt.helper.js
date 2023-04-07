import jwt from 'jsonwebtoken';

export default {
    generateToken: (user, secretSignature, tokenLife) => {
        return new Promise((resolve, reject) => {
            const userData = {
                _id: user._id,
                name: user.name,
                email: user.email,
            };

            jwt.sign(
                { user: userData },
                secretSignature,
                {
                    algorithm: "HS256",
                    expiresIn: tokenLife,
                },
                (error, token) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(token);
                }
            );
        });
    },

    verifyToken: (token, secretKey) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (error, decoded) => {
                if (error) {
                    return reject(error);
                }
                resolve(decoded);
            });
        });
    },
};
