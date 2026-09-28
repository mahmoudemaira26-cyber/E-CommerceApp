import DBRepo from "./DB_Repo.js";
import {CategoryModel, IHCategory,Category} from "../Models/CategoryModel.js"
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
export class CategoryRepo extends DBRepo<Category>{
constructor(@InjectModel(Category.name) CategoryModel:Model<Category>){
    super(CategoryModel)
}
}