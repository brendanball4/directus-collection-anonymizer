<template>
	<private-view title="Collection Data Anonymizer">
		<div class="anonymizer-page">
			<div class="anonymizer-wrapper">
				<p class="anonymizer-subtitle">
					Select one or more collections, then choose which columns to anonymize and which fake
					data type should replace each value.
				</p>

			<div class="anonymizer-card">
				<label class="anonymizer-label" for="collections">Collections</label>
				<select
					id="collections"
					v-model="selectedCollections"
					multiple
					size="8"
					class="anonymizer-input"
					@change="handleCollectionSelectionChange"
				>
					<option v-for="collection in collections" :key="collection.collection" :value="collection.collection">
						{{ collection.collection }}
					</option>
				</select>
				<p class="anonymizer-hint">Hold Ctrl/Cmd to select multiple collections.</p>
			</div>

			<div v-if="selectedCollections.length > 0" class="anonymizer-sections">
				<div v-for="collectionName in selectedCollections" :key="collectionName" class="anonymizer-card">
					<div class="anonymizer-card-header">
						<h3>{{ collectionName }}</h3>
						<span class="anonymizer-hint">{{ selectedFieldsCount(collectionName) }} fields selected</span>
					</div>

					<div v-if="loadingFields[collectionName]" class="anonymizer-hint">Loading fields...</div>
					<div v-else-if="(fieldsByCollection[collectionName] ?? []).length === 0" class="anonymizer-hint">
						No fields available.
					</div>

					<div v-else class="anonymizer-field-list">
						<div
							v-for="field in fieldsByCollection[collectionName]"
							:key="`${collectionName}-${field.field}`"
							class="anonymizer-field-row"
						>
							<label class="anonymizer-field-label">
								<input
									type="checkbox"
									:checked="isFieldSelected(collectionName, field.field)"
									@change="onFieldCheckboxChange($event, collectionName, field.field)"
								/>
								<span>{{ field.field }}</span>
								<span class="anonymizer-hint anonymizer-type">({{ field.type || field.schema?.data_type || 'unknown' }})</span>
							</label>

							<select
								v-if="isFieldSelected(collectionName, field.field)"
								:value="selectedTypeForField(collectionName, field.field)"
								class="anonymizer-type-select"
								@change="onFieldTypeChange($event, collectionName, field.field)"
							>
								<option v-for="type in anonymizerTypes" :key="type.value" :value="type.value">
									{{ type.label }}
								</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			<div class="anonymizer-warning-card">
				<p class="anonymizer-warning-title">Warning: Destructive Action</p>
				<p class="anonymizer-warning-text">
					Anonymization permanently overwrites data in the selected collection(s). Only run this in
					local development or staging environments.
				</p>
				<label class="anonymizer-warning-checkbox">
					<input v-model="hasAcknowledgedDestructiveAction" type="checkbox" />
					<span>I understand this action is destructive and should not be used in production.</span>
				</label>
			</div>

			<div class="anonymizer-actions">
				<button :disabled="isRunning || !canRunAnonymization" class="anonymizer-primary" @click="runAnonymization">
					{{ isRunning ? 'Anonymizing...' : 'Run anonymization' }}
				</button>
				<span v-if="progressText" class="anonymizer-hint">{{ progressText }}</span>
			</div>

			<div v-if="runSummary" class="anonymizer-card anonymizer-summary">
				<h3>Result</h3>
				<p>{{ runSummary }}</p>
			</div>
			</div>
		</div>
	</private-view>
</template>
<script lang="ts">
import ModuleController from './module-controller';

export default ModuleController;
</script>
<style scoped>
@import './module.css';
</style>
