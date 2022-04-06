export declare type ValidatorError = boolean | string | null | undefined;
export declare type Validator = (v: FieldValue, data: any) => ValidatorError;
export declare type FieldValue = any;
export interface FormField {
    value?: FieldValue;
    validate?: Validator[] | Validator;
}
export declare function useReform<T extends {
    [x: string]: FieldValue;
}>(fields: {
    [name: string]: FormField;
}): {
    data: import("vue").UnwrapRef<import("vue").UnwrapNestedRefs<T>>;
    changes: {
        [key: string]: any;
    };
    commit: () => import("vue").UnwrapNestedRefs<T>;
    rollback: () => void;
    errors: {
        [x: string]: ValidatorError;
    };
    validate: () => boolean;
    validateField: (name: string) => boolean;
    dirty: boolean;
    addErrors: (newErrors: {
        [key: string]: string | string[];
    }) => void;
};
