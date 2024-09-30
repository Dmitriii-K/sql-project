import { IsNumber } from "class-validator";
import { EnvironmentVariable } from "../configuration";

export class ApiSettings {
    constructor(private environmentVariables: EnvironmentVariable) {}
    @IsNumber()
    // PORT: number = Number(this.environmentVariables.PORT);
    PORT_SQL: number = Number(this.environmentVariables.PORT_SQL);
}