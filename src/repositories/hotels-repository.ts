import { prisma } from "@/config";

async function getHotels() {
    try {
        const hotels = await prisma.hotel.findMany();
        return hotels;
    } catch (error) {
        throw error;
    }
}

async function getHotelRoom(hotelId: number) {
    try {
        const hotel = await prisma.hotel.findFirst({
            where: {
                id: hotelId
            },
            include: {
                Rooms: true
            }
        });
        return hotel;
    } catch (error) {
        throw error;
    }
}

export default { getHotels, getHotelRoom };
