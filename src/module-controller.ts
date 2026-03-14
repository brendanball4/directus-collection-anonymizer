import { useApi } from '@directus/extensions-sdk';
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { ANONYMIZER_TYPES } from './anonymizer/options';
import { generateValue } from './anonymizer/value-generator';
import type { AnonymizerType, CollectionField, CollectionInfo, FieldConfig } from './anonymizer/types';

export default defineComponent({
	setup() {
		const api = useApi();

		const collections = ref<CollectionInfo[]>([]);
		const selectedCollections = ref<string[]>([]);
		const fieldsByCollection = reactive<Record<string, CollectionField[]>>({});
		const loadingFields = reactive<Record<string, boolean>>({});
		const selectedFieldConfig = reactive<Record<string, Record<string, FieldConfig>>>({});
		const primaryKeyByCollection = reactive<Record<string, string>>({});

		const isRunning = ref(false);
		const progressText = ref('');
		const runSummary = ref('');
		const hasAcknowledgedDestructiveAction = ref(false);

		const hasAnySelectedField = computed(() =>
			Object.values(selectedFieldConfig).some((byField) => Object.keys(byField).length > 0)
		);
		const canRunAnonymization = computed(
			() => hasAnySelectedField.value && hasAcknowledgedDestructiveAction.value
		);

		const loadCollections = async (): Promise<void> => {
			const response = await api.get('/collections');
			const all = (response?.data?.data ?? []) as CollectionInfo[];
			collections.value = all.filter((collection) => !collection.meta?.system);
		};

		const loadFieldsForCollection = async (collectionName: string): Promise<void> => {
			if (fieldsByCollection[collectionName]) return;

			loadingFields[collectionName] = true;
			try {
				const response = await api.get(`/fields/${collectionName}`);
				const fields = (response?.data?.data ?? []) as CollectionField[];
				fieldsByCollection[collectionName] = fields;

				const primaryField = fields.find((field) => field.schema?.is_primary_key);
				primaryKeyByCollection[collectionName] = primaryField?.field ?? 'id';
			} finally {
				loadingFields[collectionName] = false;
			}
		};

		const handleCollectionSelectionChange = async (): Promise<void> => {
			await Promise.all(selectedCollections.value.map((collectionName) => loadFieldsForCollection(collectionName)));
		};

		const isFieldSelected = (collectionName: string, fieldName: string): boolean =>
			Boolean(selectedFieldConfig[collectionName]?.[fieldName]);

		const selectedTypeForField = (collectionName: string, fieldName: string): AnonymizerType =>
			selectedFieldConfig[collectionName]?.[fieldName]?.type ?? 'text';

		const selectedFieldsCount = (collectionName: string): number =>
			Object.keys(selectedFieldConfig[collectionName] ?? {}).length;

		const toggleFieldSelection = (collectionName: string, fieldName: string, checked: boolean): void => {
			if (!selectedFieldConfig[collectionName]) selectedFieldConfig[collectionName] = {};

			if (checked) {
				selectedFieldConfig[collectionName][fieldName] = { type: 'text' };
			} else {
				delete selectedFieldConfig[collectionName][fieldName];
			}
		};

		const setFieldType = (collectionName: string, fieldName: string, typeValue: string): void => {
			if (!selectedFieldConfig[collectionName]?.[fieldName]) return;
			selectedFieldConfig[collectionName][fieldName].type = (typeValue as AnonymizerType) ?? 'text';
		};

		const onFieldCheckboxChange = (event: Event, collectionName: string, fieldName: string): void => {
			const target = event.target as HTMLInputElement | null;
			toggleFieldSelection(collectionName, fieldName, Boolean(target?.checked));
		};

		const onFieldTypeChange = (event: Event, collectionName: string, fieldName: string): void => {
			const target = event.target as HTMLSelectElement | null;
			setFieldType(collectionName, fieldName, target?.value ?? 'text');
		};

		const runAnonymization = async (): Promise<void> => {
			if (!canRunAnonymization.value) {
				runSummary.value =
					'Please acknowledge the destructive action warning before running anonymization.';
				return;
			}

			isRunning.value = true;
			runSummary.value = '';

			let updatedItemsTotal = 0;
			const collectionSummaries: string[] = [];

			try {
				for (const collectionName of selectedCollections.value) {
					const fieldConfig = selectedFieldConfig[collectionName] ?? {};
					const fieldNames = Object.keys(fieldConfig);
					if (fieldNames.length === 0) continue;

					const primaryKey = primaryKeyByCollection[collectionName] ?? 'id';
					const fieldsToFetch = [primaryKey, ...fieldNames];
					const limit = 200;
					let offset = 0;
					let collectionUpdates = 0;

					while (true) {
						progressText.value = `Reading ${collectionName} items (offset ${offset})...`;
						const response = await api.get(`/items/${collectionName}`, {
							params: {
								fields: fieldsToFetch.join(','),
								limit,
								offset,
							},
						});

						const items = (response?.data?.data ?? []) as Record<string, unknown>[];
						if (items.length === 0) break;

						for (const item of items) {
							const itemPrimaryKey = item[primaryKey];
							if (itemPrimaryKey === undefined || itemPrimaryKey === null) continue;

							const payload: Record<string, string> = {};
							for (const fieldName of fieldNames) {
								const fieldType = fieldConfig[fieldName]?.type ?? 'text';
								payload[fieldName] = generateValue(fieldType);
							}

							progressText.value = `Updating ${collectionName} #${String(itemPrimaryKey)}...`;
							await api.patch(`/items/${collectionName}/${itemPrimaryKey}`, payload);
							collectionUpdates += 1;
						}

						offset += limit;
					}

					updatedItemsTotal += collectionUpdates;
					collectionSummaries.push(`${collectionName}: ${collectionUpdates} items updated`);
				}

				runSummary.value = `Done. Updated ${updatedItemsTotal} items. ${collectionSummaries.join(' | ')}`;
			} catch (error) {
				const fallback = 'Unknown error while anonymizing.';
				if (error instanceof Error) {
					runSummary.value = `Failed: ${error.message}`;
				} else {
					runSummary.value = fallback;
				}
			} finally {
				isRunning.value = false;
				progressText.value = '';
			}
		};

		onMounted(async () => {
			await loadCollections();
		});

		return {
			anonymizerTypes: ANONYMIZER_TYPES,
			collections,
			fieldsByCollection,
			handleCollectionSelectionChange,
			hasAnySelectedField,
			canRunAnonymization,
			hasAcknowledgedDestructiveAction,
			isFieldSelected,
			isRunning,
			loadingFields,
			onFieldCheckboxChange,
			onFieldTypeChange,
			progressText,
			runAnonymization,
			runSummary,
			selectedCollections,
			selectedFieldsCount,
			selectedTypeForField,
		};
	},
});
