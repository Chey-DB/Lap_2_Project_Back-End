const {v4: uuidv4} = require("uuid")

const db = require("../database/connect.js")

class Token {
    constructor ({ token_id, user_id, token }) {
        this.id = token_id;
        this.user_id = user_id;
        this.token = token;
    }
    
    static async create(user_id) {
        try {
            const token = uuidv4();
            console.log(token);
            const response = await db.query("INSERT INTO tokens (user_id, token) VALUES ($1, $2) RETURNING token_id;", [user_id, token]);
            console.log(response.rows[0]);
            const newId = response.rows[0].token_id;
            console.log(newId);
            const newToken = await Token.getOneById(newId);

            return newToken;
        } catch (err) {
            return err.message;
        }
    }

    static async getOneByToken(token) {
        try {
            const userToken = await db.query("SELECT * FROM tokens WHERE token = $1", [token]);
            return new Token(userToken.rows[0]);
        } catch (err) {
            return err.message;
        }
    }

    static async getOneById(token_id) {
        try {
            const userToken = await db.query("SELECT * FROM tokens WHERE token_id = $1", [token_id]);
            // console.log(userToken.rows[0]);
            return new Token(userToken.rows[0]);
        } catch (err) {
            console.log("error in getOneById")
            return err.message;
        }
    }

    static async destroy(id) {
        try {
            const deletedToken = await db.query("DELETE FROM tokens WHERE token_id = $1", [id]);
            return new Token(deletedToken.rows[0]);
        } catch (err) {
            return err.message;
        }
    }
}

module.exports = Token;
