import type { AnonymizerType } from './types';

const FIRST_NAMES = [
	'Emma', 'Noah', 'Olivia', 'Liam', 'Ava', 'Mason', 'Sofia', 'Lucas', 'Mia', 'Ethan',
	'Isabella', 'Logan', 'Aria', 'Elijah', 'Amelia', 'James', 'Nora', 'Benjamin', 'Zoe', 'Henry',
	'Layla', 'Jack', 'Chloe', 'Owen', 'Grace', 'Leo', 'Stella', 'Daniel', 'Hazel', 'Julian',
	'Elena', 'Mateo', 'Violet', 'Wyatt', 'Aurora', 'Caleb', 'Scarlett', 'Nathan', 'Penelope', 'Isaac',
];
const LAST_NAMES = [
	'Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Martin', 'Thomas', 'Moore', 'Lee', 'Clark',
	'Walker', 'Harris', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Green', 'Baker', 'Adams',
	'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans',
	'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Cook', 'Morgan', 'Bell', 'Murphy',
];
const COMPANIES = [
	'Northwind Labs', 'Blue Harbor', 'Summit Works', 'Brightline Studio', 'Riverstone Group',
	'Aurora Dynamics', 'Granite Point', 'Skyline Systems', 'Pioneer Forge', 'Harborview Tech',
	'Evergreen Analytics', 'Atlas Solutions', 'Helix Ventures', 'Ironclad Networks', 'Vector Horizon',
	'Cobalt Industries', 'Nova Peak', 'Silver Oak Partners', 'Beacon Cloud', 'Maple Ridge Digital',
];
const STREETS = [
	'Oak Street', 'Maple Avenue', 'Cedar Road', 'Pine Lane', 'Elm Street',
	'Willow Drive', 'Birch Court', 'Highland Way', 'Sunset Boulevard', 'Parkside Avenue',
	'Meadow Lane', 'Lakeview Drive', 'Hillcrest Road', 'Riverside Court', 'Forest Trail',
];
const CITIES = [
	'Seattle', 'Toronto', 'Chicago', 'Vancouver', 'Montreal', 'Denver', 'Austin', 'Calgary', 'Boston', 'Ottawa',
	'Portland', 'Edmonton', 'San Diego', 'Quebec City', 'Phoenix', 'Winnipeg', 'Nashville', 'Hamilton', 'Minneapolis', 'Halifax',
];
const US_STATES = [
	'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
	'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
	'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
	'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
	'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
];
const PROVINCES = [
	'Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick',
	'Newfoundland and Labrador', 'Prince Edward Island', 'Northwest Territories', 'Yukon', 'Nunavut',
];
const COUNTRIES = [
	'United States', 'Canada',
];
const DOMAINS = [
	'example.com', 'example.ca', 'sample.org', 'demo.net', 'mail.test', 'acme.io', 'northwind.dev', 'test.ca', 'sandbox.us', 'demo.ca',
];

const randomFrom = <T,>(list: T[]): T => {
	const value = list[Math.floor(Math.random() * list.length)];
	if (value === undefined) throw new Error('Cannot select random value from an empty list.');
	return value;
};

const randomDigits = (length: number): string => {
	let out = '';
	for (let i = 0; i < length; i += 1) out += Math.floor(Math.random() * 10).toString();
	return out;
};

export const generateValue = (type: AnonymizerType): string => {
	const first = randomFrom(FIRST_NAMES);
	const last = randomFrom(LAST_NAMES);

	switch (type) {
		case 'first_name':
			return first;
		case 'last_name':
			return last;
		case 'full_name':
			return `${first} ${last}`;
		case 'email':
			return `${first.toLowerCase()}.${last.toLowerCase()}${randomDigits(4)}@${randomFrom(DOMAINS)}`;
		case 'phone':
			return `+1-${randomDigits(3)}-${randomDigits(3)}-${randomDigits(4)}`;
		case 'company':
			return randomFrom(COMPANIES);
		case 'address':
			return `${Math.floor(Math.random() * 900) + 100} ${randomFrom(STREETS)}`;
		case 'city':
			return randomFrom(CITIES);
		case 'state':
			return randomFrom(US_STATES);
		case 'province':
			return randomFrom(PROVINCES);
		case 'country':
			return randomFrom(COUNTRIES);
		case 'uuid':
			return crypto.randomUUID();
		case 'text':
		default:
			return `anonymized_${randomDigits(8)}`;
	}
};
