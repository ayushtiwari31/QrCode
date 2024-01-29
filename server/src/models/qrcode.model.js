import mongoose, {Schema} from "mongoose";



const qrcodeSchema = new Schema(
    {
        data:Buffer
    },
    {
        timestamps: true
    }
)

export const QRcode = mongoose.model("QRcode", qrcodeSchema)
