import { TCategoryDTO} from '../DTO/categoryDTO';
import { TCategory } from '../interface/Category.interface';

class CategoryMapper{
     categoryMapper(categories : TCategory[]):TCategoryDTO[]{
         return  categories.map((category)=> {
                return {
                       _id:category._id.toString(),
                       name:category.name,
                       description:category.description,
                       image:category.image,
                       status:category.status,
                }
            })
     }
}

const categoryMapper = new CategoryMapper();

export default categoryMapper;