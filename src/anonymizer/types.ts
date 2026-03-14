export type AnonymizerType =
	| 'first_name'
	| 'last_name'
	| 'full_name'
	| 'email'
	| 'phone'
	| 'company'
	| 'address'
	| 'city'
	| 'state'
	| 'province'
	| 'country'
	| 'uuid'
	| 'text';

export type FieldConfig = {
	type: AnonymizerType;
};

export type CollectionInfo = {
	collection: string;
	meta?: {
		system?: boolean;
		hidden?: boolean;
	};
};

export type CollectionField = {
	field: string;
	type?: string;
	schema?: {
		data_type?: string;
		is_primary_key?: boolean;
	};
};
