import { ModelCtor, Model, BelongsToOptions, HasOneOptions, HasManyOptions, BelongsToManyOptions } from "sequelize/types";

export interface ModelBelongsToMetadata {
  model: ModelCtor<Model>,
  options: BelongsToOptions
}

export interface ModelHasOneMetadata {
  model: ModelCtor<Model>,
  options: HasOneOptions
}

export interface ModelHasManyMetadata {
  model: ModelCtor<Model>,
  options: HasManyOptions
}

export interface ModelBelongsToManyMetadata {
  model: ModelCtor<Model>,
  options: BelongsToManyOptions
}
