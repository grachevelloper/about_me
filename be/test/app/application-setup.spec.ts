import {afterEach, beforeEach, describe, expect, it} from "@jest/globals";
import {Body, Controller, Get, INestApplication, Post} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {Type} from "class-transformer";
import {IsInt, IsString} from "class-validator";
import {configureApplication} from "src/app/application-setup";
import {CurrentUser} from "src/shared/decorators/current-user.decorator";
import {AuthenticatedUser, Role} from "src/types";
import request from "supertest";

class ValidationTestDto {
    @IsString()
    name: string;

    @Type(() => Number)
    @IsInt()
    count: number;
}

@Controller("stage-two-test")
class StageTwoTestController {
    @Post("validation")
    validate(@Body() body: ValidationTestDto) {
        return {
            body,
            transformed: body instanceof ValidationTestDto,
        };
    }

    @Get("current-user")
    currentUser(@CurrentUser() user: AuthenticatedUser) {
        return user;
    }
}

describe("configureApplication", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [StageTwoTestController],
        }).compile();

        app = moduleRef.createNestApplication();
        app.use(
            (
                req: Express.Request,
                _res: Express.Response,
                next: () => void,
            ) => {
                req.user = {
                    id: "f449353c-8c3f-46b5-a6c2-d52798d141a5",
                    role: Role.USER,
                    iat: 1,
                    exp: 2,
                };
                next();
            },
        );
        configureApplication(app);
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it("applies the API prefix and transforms valid DTO input", async () => {
        const response = await request(app.getHttpServer())
            .post("/api/stage-two-test/validation")
            .send({name: "test", count: "2"})
            .expect(201);

        expect(response.body).toEqual({
            body: {name: "test", count: 2},
            transformed: true,
        });
    });

    it("rejects properties outside the request DTO", async () => {
        await request(app.getHttpServer())
            .post("/api/stage-two-test/validation")
            .send({name: "test", count: 2, authorId: "client-controlled"})
            .expect(400);
    });

    it("injects the authenticated user from the request", async () => {
        const response = await request(app.getHttpServer())
            .get("/api/stage-two-test/current-user")
            .expect(200);

        expect(response.body).toEqual({
            id: "f449353c-8c3f-46b5-a6c2-d52798d141a5",
            role: "User",
            iat: 1,
            exp: 2,
        });
    });
});
