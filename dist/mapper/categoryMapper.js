"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CategoryMapper {
    categoryMapper(categories) {
        return categories.map((category) => {
            return {
                _id: category._id.toString(),
                name: category.name,
                description: category.description,
                image: category.image,
                status: category.status,
            };
        });
    }
}
const categoryMapper = new CategoryMapper();
exports.default = categoryMapper;
