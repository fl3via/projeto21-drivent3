import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotelRoom, getHotels } from "@/controllers/hotels-controllers";


const hotelsRouter = Router()

hotelsRouter.get("/", authenticateToken, getHotels)
hotelsRouter.get("/:hotelId", authenticateToken, getHotelRoom)

export { hotelsRouter }