import app, { init } from "@/app";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotel, createPayment, createRooms, createTicket, createTicketTypeRemote, createTicketTypeWithHotel, createUser } from "../factories";

import { cleanDb, generateValidToken } from "../helpers";

const server = supertest(app);

beforeAll(async () => {
    await init();
    await cleanDb();
});

beforeEach(async () => {
    await cleanDb();
});

async function requestWithToken(url: string, token: string) {
    return server.get(url).set("Authorization", `Bearer ${token}`);
}

async function createPaidTicket(user: any) {
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    return ticket;
}

describe("GET /hotels", () => {
    // ... Testes anteriores omitidos

    it("Deve retornar 200 e a lista de hotéis", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const ticket = await createPaidTicket(user);
        const hotel = await createHotel();

        const response = await requestWithToken("/hotels", token);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([
            {
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: hotel.createdAt.toISOString(),
                updatedAt: hotel.updatedAt.toISOString(),
            },
        ]);
    });
});

describe("GET /hotels/:id", () => {
   

    it("Deve retornar 200 e lista de hotéis com quartos", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const ticket = await createPaidTicket(user);
        const hotel = await createHotel();
        const room = await createRooms(hotel.id);

        const response = await requestWithToken(`/hotels/${hotel.id}`, token);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),
            Rooms: [
                {
                    id: room.id,
                    name: room.name,
                    capacity: room.capacity,
                    hotelId: hotel.id,
                    createdAt: room.createdAt.toISOString(),
                    updatedAt: room.updatedAt.toISOString(),
                },
            ],
        });
    });
});
