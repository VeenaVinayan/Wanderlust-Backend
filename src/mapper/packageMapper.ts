import { TPackageData } from "../Types/Package.types";
import { TPackageDataDTO } from "../DTO/packageDTO";

class PackageMapper {
  userPackageData(data: TPackageData[]): TPackageDataDTO[] {
    const dtoValue: TPackageDataDTO[] = data.map((value): TPackageDataDTO => {
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
        discount: value.discount ?? 0,
        isVerified:value.isVerified,
        coordinates: {
          latitude: value.coordinates?.latitude ?? 0,
          longitude: value.coordinates?.longitude ?? 0,
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
export default packageMapper;
