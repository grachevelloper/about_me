import {INestApplication, ValidationPipe} from "@nestjs/common";
import cookieParser from "cookie-parser";

export function configureApplication(app: INestApplication): void {
    app.setGlobalPrefix("api");
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
}
