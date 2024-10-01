import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class TestingService {
    constructor(@InjectDataSource() private dataSource: DataSource) {}

    async deleteAllData(): Promise<void> {
        const truncateUser = `
        TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE
    `;
    const truncateSessions = `
        TRUNCATE TABLE "Sessions" RESTART IDENTITY CASCADE
    `;
        await this.dataSource.query(truncateUser);
        await this.dataSource.query(truncateSessions);
        console.log('All data of tables is deleted');
    }
}

//DELETE FROM "Users"; альтернативный но более медленный запрос не удаляет id из памяти