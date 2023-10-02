import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import hotelsServices from "@/services/hotels-services";

const errorStatusMap: { [key: string]: number } = {
    notFoundError: httpStatus.NOT_FOUND,
    PaymentRequiredError: httpStatus.PAYMENT_REQUIRED,
}

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req

    try {
        const hotels = await hotelsServices.getHotels(userId)
        return res.status(httpStatus.OK).send(hotels)
    } catch (error) {
        const status = errorStatusMap[error.name] || httpStatus.BAD_REQUEST;
        return res.status(status).send(error.message)
    }
}

export async function getHotelRoom(req: AuthenticatedRequest, res: Response) {
    const { userId } = req
    const { hotelId } = req.params

    try {
        const hotel = await hotelsServices.getHotelRoom(userId, Number(hotelId))
        return res.send(hotel)
    } catch (error) {
        const status = errorStatusMap[error.name] || httpStatus.BAD_REQUEST
        return res.status(status).send(error.message)
    }
}
