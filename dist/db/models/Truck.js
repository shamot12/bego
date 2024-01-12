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
// Truck schema based on Truck interface
const truckSchema = new Schema({
    model: {
        type: String,
        required: [true, 'Model required']
    },
    make: {
        type: String,
        required: [true, 'Make required']
    },
    year: {
        type: Number,
        required: [true, 'Year required']
    },
    color: {
        type: String,
        required: [true, 'Color required']
    },
    transportWeight: {
        type: Number,
        required: [true, 'Transport Weight required']
    },
    created_at: {
        type: Number,
        required: [true, 'Created_at required']
    }
});
/**
 * Gets all existing trucks
 * @returns Trucks document array
 */
truckSchema.static('getAllTrucks', function getAllTrucks() {
    return __awaiter(this, void 0, void 0, function* () {
        const trucks = yield Truck.find();
        return trucks;
    });
});
// Truck model based on Truck schema
const Truck = model('Truck', truckSchema);
export { Truck };
