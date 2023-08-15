import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User> ;

@Schema()
export class User {
    @Prop({
        type: String, default: function genUUID() {
            return uuidv4()
        }
    })
    _id: string;

    @Prop({ unique: true, required: true})
    email: string;

    @Prop({ required: true, select: false})
    password: string;

    @Prop({ required: true})
    name: string;

    @Prop()
    surname: string;

    @Prop({ required: true, default: Date.now})
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);