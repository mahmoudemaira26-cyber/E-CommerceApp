import { MongooseUpdateQueryOptions } from 'mongoose';
import {
  CreateOptions,
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

abstract class DBRepo<T> {
  constructor(protected Model: Model<T>) {}

  async Creating({ data, options }: { data: any; options?: CreateOptions }) {
    return this.Model.create(data, options);
  }
  async FindingOne({
    filter,
    projection,
    options,
  }: {
    filter: QueryFilter<T>;
    projection?: ProjectionType<T>;
    options?: QueryOptions;
  }) {
    return this.Model.findOne(filter, projection, options);
  }
  async UpdatingOne({
    filter,
    update,
    options,
  }: {
    filter: QueryFilter<T>;
    update: UpdateQuery<T>;
    options?: MongooseUpdateQueryOptions;
  }) {
    return await this.Model.updateOne(filter, update, options);
  }
  async FindingById({
    id,
    projection,
    options,
  }: {
    id: any;
    projection?: ProjectionType<T>;
    options?: QueryOptions<T>;
  }) {
    return await this.Model.findById(id, projection, options);
  }
  async Finding({
    filter,
    projection,
    options,
  }: {
    filter?: QueryFilter<T>;
    projection?: ProjectionType<T>;
    options?: QueryOptions<T>;
  }) {
    return this.Model.find(filter, projection, options);
  }
  async FindingOneAndUpdate({
    filter,
    update,
    options,
  }: {
    filter: QueryFilter<T>;
    update: UpdateQuery<T>;
    options?: QueryOptions;
  }) {
    return await this.Model.findOneAndUpdate(filter, update, {
      returnDocument: 'after',
      ...options,
    });
  }
}
export default DBRepo;
