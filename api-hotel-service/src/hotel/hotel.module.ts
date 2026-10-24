import { Module } from "@nestjs/common";
import { SendWelcomeEmailConsumer } from "./consumers/send-welcome-email.service.js";

@Module(
    {
        imports: [],
        controllers: [],
        providers: [SendWelcomeEmailConsumer],
        exports: []
     }
)
export class HotelModule {};