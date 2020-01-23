import { Sequelize, ModelAttributes, ModelAttributeColumnOptions, ModelOptions, ModelCtor, ModelValidateOptions, Model, BelongsToOptions, HasOneOptions, HasManyOptions, BelongsToManyOptions } from 'sequelize';
import { ModelBelongsToMetadata, ModelHasOneMetadata, ModelHasManyMetadata, ModelBelongsToManyMetadata } from '../interfaces/model-metadata';

const { DATABASE_PATH } = process.env;

const sequelize: Sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DATABASE_PATH
});

sequelize.authenticate().catch((e: Error) => {
  console.error(e.message);
  process.exit(1);
});

const MODEL_ATTRIBUTES: symbol = Symbol('MODEL_ATTRIBUTES');

const MODEL_VALIDATES: symbol = Symbol('MODEL_VALIDATES');

const MODEL_HOOKS: symbol = Symbol('MODEL_HOOKS');

const MODEL_BELONGS_TO: symbol = Symbol('MODEL_BELONGS_TO');

const MODEL_HAS_ONE: symbol = Symbol('MODEL_HAS_ONE');

const MODEL_HAS_MANY: symbol = Symbol('MODEL_HAS_MANY');

const MODEL_BELONGS_TO_MANY: symbol = Symbol('MODEL_BELONGS_TO_MANY');

export function Column(options: ModelAttributeColumnOptions): PropertyDecorator {
  return function (target: Object, key: PropertyKey): void {
    target[MODEL_ATTRIBUTES] = (target[MODEL_ATTRIBUTES] || []).concat({ field: key, ...options });
  }
}

Column.BelongsTo = function (model: ModelCtor<Model>, options: BelongsToOptions): PropertyDecorator {
  return function (target: Object, _key: PropertyKey): void {
    target[MODEL_BELONGS_TO] = (target[MODEL_BELONGS_TO] || []).concat({ model, options });
  }
}

Column.HasOne = function (model: ModelCtor<Model>, options: HasOneOptions) {
  return function (target: Object, _key: PropertyKey): void {
    target[MODEL_HAS_ONE] = (target[MODEL_HAS_ONE] || []).concat({ model, options });
  }
}

Column.HasMany = function (model: ModelCtor<Model>, options: HasManyOptions) {
  return function (target: Object, _key: PropertyKey): void {
    target[MODEL_HAS_MANY] = (target[MODEL_HAS_MANY] || []).concat({ model, options });
  }
}

Column.BelongsToMany = function (model: ModelCtor<Model>, options: BelongsToManyOptions) {
  return function (target: Object, _key: PropertyKey): void {
    target[MODEL_BELONGS_TO_MANY] = (target[MODEL_BELONGS_TO_MANY] || []).concat({ model, options });
  }
}

export function Table(modelOptions: ModelOptions | undefined = {}): ClassDecorator {
  return function (target: Function): void {
    const modelAttributes: ModelAttributes = (target.prototype[MODEL_ATTRIBUTES] || []).reduce(
      (ag: object, i: Partial<ModelAttributeColumnOptions>) => {
        const { field, ...options } = i;

        return {
          ...ag,
          [field as string]: options
        }
      },
      {}
    );

    const validate: ModelValidateOptions = (target.prototype[MODEL_VALIDATES] || []).reduce((ag: object, i: Partial<ModelValidateOptions>) => ({ ...ag, ...i }), {});

    (target as ModelCtor<Model>).init(modelAttributes, {
      ...modelOptions,
      validate,
      hooks: (target[MODEL_HOOKS] || {}),
      sequelize
    });

    (target[MODEL_BELONGS_TO] || []).forEach((b: ModelBelongsToMetadata) => {
      (target as ModelCtor<Model>).belongsTo(b.model, b.options);
    });

    (target[MODEL_HAS_ONE] || []).forEach((b: ModelHasOneMetadata) => {
      (target as ModelCtor<Model>).hasOne(b.model, b.options);
    });

    (target[MODEL_HAS_MANY] || []).forEach((b: ModelHasManyMetadata) => {
      (target as ModelCtor<Model>).hasMany(b.model, b.options);
    });

    (target[MODEL_BELONGS_TO_MANY] || []).forEach((b: ModelBelongsToManyMetadata) => {
      (target as ModelCtor<Model>).belongsToMany(b.model, b.options);
    });

    (target as ModelCtor<Model>).sync().catch((e: Error) => {
      console.error(e.message);
      process.exit(1);
    });
  }
}

export function Validate(): MethodDecorator {
  return function (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void {
    target[MODEL_VALIDATES] = (target[MODEL_VALIDATES] || []).concat({ [key]: descriptor.value.bind(target) });
  }
}

export function Hook(name: string): MethodDecorator {
  return function (target: Object, _key: PropertyKey, descriptor: PropertyDescriptor): void {
    target[MODEL_HOOKS] = (target[MODEL_HOOKS] || {})[name] = descriptor.value.bind(target);
  }
}
