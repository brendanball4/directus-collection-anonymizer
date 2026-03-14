import { defineModule } from '@directus/extensions-sdk';
import ModuleComponent from './module.vue';

export default defineModule({
	id: 'collection-data-anonymizer',
	name: 'Data Anonymizer',
	icon: 'shield',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		},
	],
});
