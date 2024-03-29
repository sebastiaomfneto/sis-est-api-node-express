import { Sequelize, ModelAttributes, ModelAttributeColumnOptions, ModelOptions, ModelCtor, ModelValidateOptions, Model, BelongsToOptions, HasOneOptions, HasManyOptions, BelongsToManyOptions } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import { SchemaObject } from 'openapi3-ts';

type ModelBelongsToMetadata = {
  model: ModelCtor<Model>,
  options: BelongsToOptions
}

type ModelHasOneMetadata = {
  model: ModelCtor<Model>,
  options: HasOneOptions
}

type ModelHasManyMetadata = {
  model: ModelCtor<Model>,
  options: HasManyOptions
}

type ModelBelongsToManyMetadata = {
  model: ModelCtor<Model>,
  options: BelongsToManyOptions
}

function convertSequelizeDataTypeToOpenApiDataType(type: string): string {
  if (type.startsWith('DATE') || type.startsWith('STRING') || type.startsWith('ENUM')) {
    return 'string';
  }

  if (type.startsWith('FLOAT') || type.startsWith('REAL') || type.startsWith('DOUBLE') || type.startsWith('DECIMAL')) {
    return 'number';
  }

  if (type === 'INTEGER' || type.startsWith('BIGINT')) {
    return 'integer';
  }

  if (type === 'BOOLEAN') {
    return 'boolean';
  }

  if (type.startsWith('ARRAY')) {
    return 'array';
  }

  if (type.startsWith('JSON')) {
    return 'object';
  }

  return '';
}

const sequelizeConfig: { [key: string]: any } = require('../../../db/config/config.js')

const { NODE_ENV = 'development' } = process.env;

const sequelize: Sequelize = new Sequelize(sequelizeConfig[NODE_ENV]);

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

export const swaggerDocumentComponentsSchemas: { [modelName: string]: SchemaObject } = {};

export function Column(options: ModelAttributeColumnOptions): PropertyDecorator {
  return function (target: Object, key: PropertyKey): void {
    const values: ModelAttributeColumnOptions[] | undefined = Object.getOwnPropertyDescriptor(target, MODEL_ATTRIBUTES)?.value;

    Object.defineProperty(target, MODEL_ATTRIBUTES, {
      configurable: true,
      value: (values ?? []).concat({ field: key as string, ...options })
    });
  }
}

Column.BelongsTo = function (model: ModelCtor<Model>, options: BelongsToOptions): PropertyDecorator {
  return function (target: Object, _key: PropertyKey): void {
    const values: any[] | undefined = Object.getOwnPropertyDescriptor(target, MODEL_BELONGS_TO)?.value;

    Object.defineProperty(target, MODEL_BELONGS_TO, {
      configurable: true,
      value: (values ?? []).concat({ model, options })
    });
  }
}

Column.HasOne = function (model: ModelCtor<Model>, options: HasOneOptions): PropertyDecorator {
  return function (target: Object, _key: PropertyKey): void {
    const values: any[] | undefined = Object.getOwnPropertyDescriptor(target, MODEL_HAS_ONE)?.value;

    Object.defineProperty(target, MODEL_HAS_ONE, {
      configurable: true,
      value: (values ?? []).concat({ model, options })
    });
  }
}

Column.HasMany = function (model: ModelCtor<Model>, options: HasManyOptions): PropertyDecorator {
  return function (target: Object, _key: PropertyKey): void {
    const values: ModelHasManyMetadata[] | undefined = Object.getOwnPropertyDescriptor(target, MODEL_HAS_MANY)?.value;

    Object.defineProperty(target, MODEL_HAS_MANY, {
      configurable: true,
      value: (values ?? []).concat({ model, options })
    });
  }
}

Column.BelongsToMany = function (model: ModelCtor<Model>, options: BelongsToManyOptions): PropertyDecorator {
  return function (target: Object, _key: PropertyKey): void {
    const values: ModelBelongsToMetadata[] | undefined = Object.getOwnPropertyDescriptor(target, MODEL_BELONGS_TO_MANY)?.value;

    Object.defineProperty(target, MODEL_BELONGS_TO_MANY, {
      configurable: true,
      value: (values ?? []).concat({ model, options })
    });
  }
}

export function Validate(): MethodDecorator {
  return function (target: Object, key: PropertyKey, descriptor: PropertyDescriptor): void {
    const values: ModelValidateOptions[] | undefined = Object.getOwnPropertyDescriptor(target, MODEL_VALIDATES)?.value;

    Object.defineProperty(target, MODEL_VALIDATES, {
      configurable: true,
      value: (values ?? []).concat({ [key]: descriptor.value.bind(target) })
    });
  }
}

export function Hook(name: keyof ModelHooks): MethodDecorator {
  return function (target: Object, _key: PropertyKey, descriptor: PropertyDescriptor): void {
    const values: { name: keyof ModelHooks, handler: Function }[] | undefined = Object.getOwnPropertyDescriptor(target, MODEL_HOOKS)?.value;

    Object.defineProperty(target, MODEL_HOOKS, {
      configurable: true,
      value: (values ?? []).concat({ name, handler: descriptor.value.bind(target) })
    });
  }
}

export function Table(modelOptions: ModelOptions | undefined = {}): ClassDecorator {
  return function (target: Function): void {
    const modelAttributesValues: ModelAttributeColumnOptions[] = Object.getOwnPropertyDescriptor(target.prototype, MODEL_ATTRIBUTES)?.value;

    const modelAttributes: ModelAttributes = modelAttributesValues.reduce(
      (ag, i) => {
        const { field, ...options } = i;

        return {
          ...ag,
          [field as string]: options
        }
      },
      {} as ModelAttributes
    );

    swaggerDocumentComponentsSchemas[target.name] = ({
      type: 'object',
      properties: modelAttributesValues.reduce(
        (ag, i) => {
          const { field, type, allowNull } = i;

          return {
            ...ag,
            [field as string]: {
              type: convertSequelizeDataTypeToOpenApiDataType(type.valueOf().valueOf().toString()),
              required: !allowNull
            }
          }
        },
        {}
      )
    } as SchemaObject)

    const modelValidateOptionsValues: ModelValidateOptions[] | undefined = Object.getOwnPropertyDescriptor(target.prototype, MODEL_VALIDATES)?.value;

    const validate: ModelValidateOptions | undefined = modelValidateOptionsValues?.reduce((ag: object, i: ModelValidateOptions) => ({ ...ag, ...i }), {});

    const modelHooksValues: { name: keyof ModelHooks, handler: Function }[] | undefined = Object.getOwnPropertyDescriptor(target, MODEL_HOOKS)?.value;

    const hooks: ModelHooks | undefined = modelHooksValues?.reduce(
      (ag, i) => {
        const { name, handler } = i;

        return {
          ...ag,
          [name]: handler
        }
      },
      {} as ModelHooks);

    (target as ModelCtor<Model>).init(modelAttributes, {
      ...modelOptions,
      validate,
      hooks,
      sequelize
    });

    const modelBelongsToValues: ModelBelongsToMetadata[] | undefined = Object.getOwnPropertyDescriptor(target.prototype, MODEL_BELONGS_TO)?.value;

    modelBelongsToValues?.forEach(b => {
      (target as ModelCtor<Model>).belongsTo(b.model, b.options);
    });

    const modelHasOneValues: ModelHasOneMetadata[] | undefined = Object.getOwnPropertyDescriptor(target.prototype, MODEL_HAS_ONE)?.value;

    modelHasOneValues?.forEach(b => {
      (target as ModelCtor<Model>).hasOne(b.model, b.options);
    });

    const modelHasManyValues: ModelHasManyMetadata[] | undefined = Object.getOwnPropertyDescriptor(target.prototype, MODEL_HAS_MANY)?.value;

    modelHasManyValues?.forEach(b => {
      (target as ModelCtor<Model>).hasMany(b.model, b.options);
    });

    const modelBelongsToManyValues: ModelBelongsToManyMetadata[] | undefined = Object.getOwnPropertyDescriptor(target.prototype, MODEL_BELONGS_TO_MANY)?.value;

    modelBelongsToManyValues?.forEach(b => {
      (target as ModelCtor<Model>).belongsToMany(b.model, b.options);
    });

    (target as ModelCtor<Model>).sync().catch((e: Error) => {
      console.error(e.message);
      process.exit(1);
    });
  }
}
