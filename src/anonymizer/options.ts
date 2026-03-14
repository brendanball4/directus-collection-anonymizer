import type { AnonymizerType } from './types';

export const ANONYMIZER_TYPES: Array<{ value: AnonymizerType; label: string }> = [
	{ value: 'first_name', label: 'First Name' },
	{ value: 'last_name', label: 'Last Name' },
	{ value: 'full_name', label: 'Full Name' },
	{ value: 'email', label: 'Email' },
	{ value: 'phone', label: 'Phone' },
	{ value: 'company', label: 'Company' },
	{ value: 'address', label: 'Address' },
	{ value: 'city', label: 'City' },
	{ value: 'state', label: 'State' },
	{ value: 'province', label: 'Province' },
	{ value: 'country', label: 'Country' },
	{ value: 'uuid', label: 'UUID' },
	{ value: 'text', label: 'Generic Text' },
];
