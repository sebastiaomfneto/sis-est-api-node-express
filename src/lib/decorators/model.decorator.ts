import { Sequelize, ModelAttributes, ModelAttributeColumnOptions, ModelOptions, ModelCtor } from 'sequelize';

const { DATABASE_PATH, NODE_ENV } = process.env;

const sequelize: Sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DATABASE_PATH,
  logging: NODE_ENV !== 'production',
});

sequelize.authenticate().catch((e: Error) => {
  console.error(e.message);
  process.exit(1);
});

const MODEL_ATTRIBUTES: symbol = Symbol('MODEL_ATTRIBUTES');

export function Column(options: ModelAttributeColumnOptions): PropertyDecorator {
  return function (target: Object, key: PropertyKey): void {
    target[MODEL_ATTRIBUTES] = (target[MODEL_ATTRIBUTES] || []).concat({ field: key, ...options });
  }
}

export function Table(modelOptions: ModelOptions | undefined = {}): ClassDecorator {
  return function (target: Function): void {
    const modelAttributes: ModelAttributes = (target.prototype[MODEL_ATTRIBUTES] || []).reduce(
      (ag: object, i: any) => {
        const { field, ...options } = i;

        return {
          ...ag,
          [field]: options
        }
      },
      {}
    );

    (target as ModelCtor<any>).init(modelAttributes, { ...modelOptions, sequelize });

    (target as ModelCtor<any>).sync().catch((e: Error) => {
      console.error(e.message);
      process.exit(1);
    });
  }
}
