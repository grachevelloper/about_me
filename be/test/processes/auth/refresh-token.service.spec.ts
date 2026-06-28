import {describe, expect, it, jest} from "@jest/globals";
import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {RefreshToken} from "src/processes/auth/refresh-token/refresh-token.entity";
import {RefreshTokensService} from "src/processes/auth/refresh-token/refresh-token.service";
import {hashToken} from "src/processes/auth/utils";
import {Repository} from "typeorm";

describe("RefreshTokensService", () => {
    it("stores only a SHA-256 hash of a new token", async () => {
        const repository = {save: jest.fn(async (value) => value)};
        const moduleRef = await Test.createTestingModule({
            providers: [
                RefreshTokensService,
                {
                    provide: getRepositoryToken(RefreshToken),
                    useValue: repository,
                },
            ],
        }).compile();
        const service = moduleRef.get(RefreshTokensService);

        const rawToken = await service.createToken(
            "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
        );

        const persisted = repository.save.mock.calls[0][0] as Partial<RefreshToken>;
        expect(persisted.tokenHash).toBe(hashToken(rawToken));
        expect(persisted.tokenHash).not.toBe(rawToken);
    });

    it("revokes a token using the same SHA-256 hash used on creation", async () => {
        const repository = {
            update: jest
                .fn<Repository<RefreshToken>["update"]>()
                .mockResolvedValue({
                    affected: 1,
                    generatedMaps: [],
                    raw: [],
                }),
        };
        const moduleRef = await Test.createTestingModule({
            providers: [
                RefreshTokensService,
                {
                    provide: getRepositoryToken(RefreshToken),
                    useValue: repository,
                },
            ],
        }).compile();
        const service = moduleRef.get(RefreshTokensService);

        await service.revokeToken(
            "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
            "raw-token",
        );

        expect(repository.update).toHaveBeenCalledWith(
            {
                userId: "82c130b1-1c47-4a0c-8a1c-e79cc39282ad",
                tokenHash: hashToken("raw-token"),
                revoked: false,
            },
            {revoked: true},
        );
    });
});
