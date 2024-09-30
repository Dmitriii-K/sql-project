import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource  } from "typeorm";
import { TypeUserPagination } from "../api/models/input.models";
import { PaginatorUserViewModel, UserViewModel } from "../api/models/output.models";
import { userPagination } from "src/base/models/user.models";
import { User } from "../domain/user.sql.entity";

@Injectable()
export class UserQueryRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    async getAllUsers(query: TypeUserPagination): Promise<PaginatorUserViewModel> {
        const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = userPagination(query);

        // Формируем фильтры
        const emailFilter = searchEmailTerm ? `AND email ILIKE '%${searchEmailTerm}%'` : '';
        const loginFilter = searchLoginTerm ? `AND login ILIKE '%${searchLoginTerm}%'` : '';

        // Формируем SQL запрос для получения пользователей
        const queryUsers = `
            SELECT * FROM users
            WHERE 1=1 ${emailFilter} ${loginFilter}
            ORDER BY ${sortBy} ${sortDirection.toUpperCase()}
            LIMIT ${pageSize} OFFSET ${(pageNumber - 1) * pageSize}
        `;

        const users = await this.dataSource.query(queryUsers);

        // Получаем общее количество пользователей
        const queryTotalCount = `
            SELECT COUNT(*) FROM users
            WHERE 1=1 ${emailFilter} ${loginFilter}
        `;
        const totalCountResult = await this.dataSource.query(queryTotalCount);
        const totalCount = parseInt(totalCountResult[0].count, 10);

        // Формируем результат
        const newUser: PaginatorUserViewModel = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: users.map(this.mapUser),
        };
        return newUser;
    }

    async getUserById(userId: string): Promise<UserViewModel | null> {
        const query = `
            SELECT * FROM users
            WHERE id = $1`;
        const user = await this.dataSource.query(query, [userId]);

        if (user.length === 0) {
            return null;
        }
        return this.mapUser(user[0]);
    }

    mapUser(user: User): UserViewModel {
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        };
    }
}