import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ResultDto } from "./dto/result.dto";

export type StatDocument = HydratedDocument<Stat>;

@Schema()
export class Stat {

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    text: string;

    @Prop({ required: true })
    result: ResultDto;

    @Prop({ required: true, default: Date.now })
    createdAt: Date;

}

export const StatSchema = SchemaFactory.createForClass(Stat);