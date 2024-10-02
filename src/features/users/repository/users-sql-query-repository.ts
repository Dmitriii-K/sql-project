import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository  } from "typeorm";
import { TypeUserPagination } from "../api/models/input.models";
import { PaginatorUserViewModel, UserViewModel } from "../api/models/output.models";
import { userPagination } from "src/base/models/user.models";
import { User } from "../domain/user.sql.entity";
import { UserRepository } from "./users-sql-repository";

@Injectable()
export class UserQueryRepository {
    constructor(
        @InjectDataSource() protected dataSource: DataSource,
        // @InjectRepository(User) protected userRepository: Repository<User>
) {}

    async getAllUsers(query: TypeUserPagination): Promise<PaginatorUserViewModel> {
        const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = userPagination(query);
    
        // Формируем фильтры
        const emailFilter = searchEmailTerm ? `"email" LIKE '%${searchEmailTerm}%'` : null;
        const loginFilter = searchLoginTerm ? `"login" LIKE '%${searchLoginTerm}%'` : null;
        const filters = [emailFilter, loginFilter]
            .filter(Boolean)
            .join(" OR ");
    
        // Формируем SQL запрос для получения пользователей
        const queryUsers = `
            SELECT * FROM "Users"
            WHERE ${filters ? `(${filters})` : '1=1'}
            ORDER BY ${sortBy} ${sortDirection.toUpperCase()}
            LIMIT ${pageSize} OFFSET ${(pageNumber - 1) * pageSize}
        `;
    
        const users = await this.dataSource.query(queryUsers);
    
        // Получаем общее количество пользователей
        const queryTotalCount = `
            SELECT COUNT(*) FROM "Users"
            WHERE ${filters ? `(${filters})` : '1=1'}
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
            SELECT * FROM "Users"
            WHERE id = $1`;
        const user = await this.dataSource.query(query, [userId]);
        //const user1 = await this.dataSource.getRepository(User).findOne({where: {id: Number(userId)}})
        //const user1 = await this.userRepository.findOne({where: {id: Number(userId)}})

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