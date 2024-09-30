import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { User } from "../domain/user.sql.entity";

@Injectable()
export class UserRepository{
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    async insertUser(user: User): Promise<string> {
        const query = `
            INSERT INTO users (login, password, email, createdAt, confirmationCode, expirationDate, isConfirmed)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [
            user.login,
            user.password,
            user.email,
            user.createdAt,
            user.confirmationCode,
            user.expirationDate,
            user.isConfirmed,
        ]);
        return result[0].id;
    }

    async findUserById(userId: string): Promise<User | null> {
        const query = `
            SELECT * FROM users
            WHERE id = $1
        `;
        const result = await this.dataSource.query(query, [userId]);
        return result.length ? result[0] : null;
    }

    async findUserByMiddleware(id: string): Promise<User | null> {
        return this.findUserById(id);
    }

    async loginIsExist(login: string): Promise<boolean> {
        const query = `
            SELECT COUNT(*) FROM users
            WHERE login = $1
        `;
        const result = await this.dataSource.query(query, [login]);
        return parseInt(result[0].count, 10) > 0;
    }

    async emailIsExist(email: string): Promise<boolean> {
        const query = `
            SELECT COUNT(*) FROM users
            WHERE email = $1
        `;
        const result = await this.dataSource.query(query, [email]);
        return parseInt(result[0].count, 10) > 0;
    }

    async findUserByLogiOrEmail(data: { login: string, email: string }): Promise<User | null> {
        const query = `
            SELECT * FROM users
            WHERE login = $1 OR email = $2
        `;
        const result = await this.dataSource.query(query, [data.login, data.email]);
        return result.length ? result[0] : null;
    }

    async deleteUser(userId: string): Promise<boolean> {
        const query = `
            DELETE FROM users
            WHERE id = $1
        `;
        const result = await this.dataSource.query(query, [userId]);
        return result.rowCount > 0;
    }

    async updateCode(userId: string, newCode: string): Promise<boolean> {
        const query = `
            UPDATE users
            SET confirmationCode = $1
            WHERE id = $2
        `;
        const result = await this.dataSource.query(query, [newCode, userId]);
        return result.rowCount > 0;
    }

    async updatePassword(userId: string, pass: string): Promise<boolean> {
        const query = `
            UPDATE users
            SET password = $1
            WHERE id = $2
        `;
        const result = await this.dataSource.query(query, [pass, userId]);
        return result.rowCount > 0;
    }

    async checkUserByRegistration(login: string, email: string): Promise<User | null> {
        return this.findUserByLogiOrEmail({ login, email });
    }

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
        const query = `
            SELECT * FROM users
            WHERE login = $1 OR email = $1
        `;
        const result = await this.dataSource.query(query, [loginOrEmail]);
        return result.length ? result[0] : null;
    }

    async createUser(user: User): Promise<string> {
        return this.insertUser(user);
    }

    async findUserByCode(code: string): Promise<User | null> {
        const query = `
            SELECT * FROM users
            WHERE confirmationCode = $1
        `;
        const result = await this.dataSource.query(query, [code]);
        return result.length ? result[0] : null;
    }

    async findUserByEmail(mail: string): Promise<User | null> {
        const query = `
            SELECT * FROM users
            WHERE email = $1
        `;
        const result = await this.dataSource.query(query, [mail]);
        return result.length ? result[0] : null;
    }

    async findOne(login: string): Promise<User | null> {
        const query = `
            SELECT * FROM users
            WHERE login = $1
        `;
        const result = await this.dataSource.query(query, [login]);
        return result.length ? result[0] : null;
    }

    async updateConfirmation(userId: string): Promise<boolean> {
        const query = `
            UPDATE users
            SET isConfirmed = true
            WHERE id = $1
        `;
        const result = await this.dataSource.query(query, [userId]);
        return result.rowCount > 0;
    }
}