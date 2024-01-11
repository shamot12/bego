var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Schema, model } from 'mongoose';
// Point schema based on Point interface
const pointSchema = new Schema({
    location: {
        name: {
            type: String,
            required: [true, 'Email address required']
        },
        placeId: {
            type: String,
            required: [true, 'Email address required']
        }
    }
});
pointSchema.static('getAllPoints', function getAllPoints() {
    return __awaiter(this, void 0, void 0, function* () {
        const points = yield Point.find();
        return points;
    });
});
// Point model based on Point schema
const Point = model('Point', pointSchema);
export { Point };
