var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Point } from '../../db/models/Point.js';
/**
 * Retrieves all points available.
 */
function AllPoints(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var points = yield Point.getAllPoints();
            res.status(200).send(points);
        }
        catch (error) {
            res.status(500).send({ success: false, errors: error.message });
        }
    });
}
export { AllPoints };
