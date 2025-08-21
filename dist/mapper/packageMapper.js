"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PackageMapper {
    userPackageData(data) {
        const dtoValue = data.map((value) => {
            var _a, _b, _c, _d, _e;
            return {
                _id: value._id.toString(),
                name: value.name,
                agent: {
                    id: value.agent._id.toString(),
                    name: value.agent.name,
                    email: value.agent.email,
                    phone: value.agent.phone,
                },
                category: value.category.toString(),
                description: value.description,
                images: value.images,
                status: value.status,
                day: value.day,
                night: value.night,
                price: value.price,
                totalCapacity: value.totalCapacity,
                discount: (_a = value.discount) !== null && _a !== void 0 ? _a : 0,
                isVerified: value.isVerified,
                coordinates: {
                    latitude: (_c = (_b = value.coordinates) === null || _b === void 0 ? void 0 : _b.latitude) !== null && _c !== void 0 ? _c : 0,
                    longitude: (_e = (_d = value.coordinates) === null || _d === void 0 ? void 0 : _d.longitude) !== null && _e !== void 0 ? _e : 0,
                },
                itinerary: value.itinerary.map((item) => ({
                    day: item.day,
                    description: item.description,
                    activities: item.activities,
                    meals: item.meals,
                    stay: item.stay,
                    transfer: item.transfer,
                })),
            };
        });
        return dtoValue;
    }
}
const packageMapper = new PackageMapper();
exports.default = packageMapper;
