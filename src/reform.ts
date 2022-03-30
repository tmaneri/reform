import { computed, reactive } from "vue";
import { isEqual, mapValues } from "lodash-es";

export type ValidatorError = boolean | string | null | undefined;

export type Validator = (v: FieldValue, data: any) => ValidatorError;

export type FieldValue = any;

export interface FormField {
  value?: FieldValue;
  validate?: Validator[] | Validator;
}

export function useReform<T extends { [x: string]: FieldValue }>(fields: {
  [name: string]: FormField;
}) {
  const defaultValues = Object.keys(fields).reduce((carry, key) => {
    return {
      ...carry,
      [key]: fields[key].value,
    };
  }, {} as T);

  const data = reactive({ ...defaultValues });
  const pristine = reactive({ ...defaultValues });

  const errors = reactive<{ [key: string]: ValidatorError }>(
    mapValues(fields, () => null)
  );

  const commit = () => Object.assign(pristine, data);
  const rollback = () => {
    Object.assign(data, pristine);
    validate();
  };

  const changes = computed(() => {
    return Object.keys(fields).reduce<{
      [key: string]: FieldValue;
    }>((changes, name) => {
      if (!isEqual(pristine[name], data[name])) {
        changes[name] = data[name];
      }
      return changes;
    }, {});
  });

  const validators: { [key: string]: Validator[] | Validator } = Object.keys(
    fields
  ).reduce((carry, key) => {
    return { ...carry, [key]: fields[key].validate || null };
  }, {});

  const validate = () => {
    return Object.keys(validators).reduce((carry, key) => {
      const validator = validators[key];

      errors[key] = (Array.isArray(validator) ? validator : [validator])
        .map((validator) =>
          typeof validator === "function"
            ? validator(data[key], data)
            : validator
        )
        .find((valid) => typeof valid === "string");

      return carry && !errors[key];
    }, true);
  };

  return reactive({
    data,
    changes,
    commit,
    rollback,
    errors,
    validate,

    dirty: computed(() => Object.keys(changes.value).length > 0),

    addErrors: (newErrors: { [key: string]: string[] | string }) => {
      Object.entries(newErrors).forEach(([name, messages]) => {
        const message = !Array.isArray(messages) ? messages : messages[0];
        errors[name] = message;
      });
    },
  });
}
