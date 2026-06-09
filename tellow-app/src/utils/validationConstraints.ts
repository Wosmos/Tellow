import { validate } from "validate.js";

type ValidateFn = (id: string, value: string) => undefined | string[];

export const validateString: ValidateFn = (id, value) => {
	const constraints = {
		presence: { allowEmpty: false },
	} as any;

	if (value !== "") {
		constraints.format = {
			pattern: "[a-z]+",
			flags: "i",
			message: "value can only contain letters",
		};
	}

	const validationResult = validate({ [id]: value }, { [id]: constraints });
	// { "username": ["Username can't be blank"] } || undefined

	return validationResult && validationResult[id];
};

export const validateEmail: ValidateFn = (id, value) => {
	const constraints = {
		presence: { allowEmpty: false },
	} as any;

	if (value !== "") {
		constraints.email = true;
	}

	const validationResult = validate({ [id]: value }, { [id]: constraints });

	return validationResult && validationResult[id];
};

export const validatePassword: ValidateFn = (id, value) => {
	const constraints = {
		presence: { allowEmpty: false },
	} as any;

	if (value !== "") {
		constraints.length = {
			minimum: 6,
			message: "must be at least 6 characters",
		};
	}

	const validationResult = validate({ [id]: value }, { [id]: constraints });

	return validationResult && validationResult[id];
};

export const validatePhone: ValidateFn = (_id, value) => {
	if (value === "") return undefined;
	const valid = /^\+?[0-9]{7,15}$/.test(value);
	return valid ? undefined : ["Phone must be 7–15 digits (optional + prefix)"];
};

export const validateLength = (id: string, value: string, minLength: number, maxLength: number, allowEmpty: boolean) => {
	const constraints = {
		presence: { allowEmpty },
	} as any;

	if (!allowEmpty || value !== "") {
		constraints.length = {};
		constraints.length.minimum = minLength;
		constraints.length.maximum = maxLength;
	}

	const validationResult = validate({ [id]: value }, { [id]: constraints });

	return validationResult && validationResult[id];
};
