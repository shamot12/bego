var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Order } from '../../db/models/Order.js';
/**
 * Retrieves all orders available.
 */
function AllOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var orders = yield Order.getAllOrders();
            res.status(200).send(orders);
        }
        catch (error) {
            res.status(500).send({ success: false, errors: error.message });
        }
    });
}
export { AllOrders };
