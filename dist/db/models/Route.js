var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Schema, model, Types } from 'mongoose';
// Route schema based on Route interface
const routeSchema = new Schema({
    pointA: { type: Types.ObjectId, ref: 'Point' },
    pointB: { type: Types.ObjectId, ref: 'Point' }
});
routeSchema.static('getAllRoutes', function getAllRoutes() {
    return __awaiter(this, void 0, void 0, function* () {
        const routes = yield Route.find().populate(['pointA', 'pointB']);
        return routes;
    });
});
// Route model based on Route schema
const Route = model('Route', routeSchema);
export { Route };
/*

{
  "_id": {
    "$oid": "65a05bc99c95279d65203827"
  },
  "pointA": "6480d4d0665cefa2836dff02",
  "pointB": "6480d4f3665cefa2836dff03"
}



{
  "_id": {
    "$oid": "65a05bc99c95279d65203827"
  },
  "pointA": {
    "_id": "6480d4d0665cefa2836dff02",
    "name": "Puerto Madero, CABA"
  },
  "pointB": {
    "_id": "6480d4f3665cefa2836dff03",
    "name": "Cristo Redentor, Las Heras, Mendoza"
  }
}

{
  "_id": {
    "$oid": "65a05bc99c95279d65203827"
  },
  "pointA": {
        "location": {
            "name": "Puerto Madero, CABA",
            "placeId": "ChIJiQPXwtk0o5URj2cW455eew4"
        }
    },
  "pointB": {
        "location": {
            "name": "Cristo Redentor, Las Heras, Mendoza",
            "placeId": "ChIJ87xEQMoIfpYRKjWtKmr3JcA"
        }
    }
}

*/ 
