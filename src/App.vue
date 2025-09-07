<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Copy, Pencil, Trash, X } from 'lucide-vue-next';

import { ClipMode } from '@/types/clipMode';
import type { ClipImage as ClipImageType } from '@/types/clipImage';

import { useExportClipImages } from '@/composables/export/exportClipImages';
import { useImportClipImages } from '@/composables/import/importClipImages';

import ClipImage from '@/components/clip-image/ClipImage.vue';
import EditClipImage from '@/components/clip-image/EditClipImage.vue';
import { Input } from '@/components/ui/input';
import SlidingToggleGroup from '@/components/ui/toggle-group/SlidingToggleGroup.vue';
import Button from '@/components/ui/button/Button.vue';
import SlidingToggleGroupItem from '@/components/ui/toggle-group/SlidingToggleGroupItem.vue';

const clipImages = ref<ClipImageType[]>([]);
const clipMode = ref<ClipMode>(ClipMode.COPY);

const searchClipImages = ref<string>();
const selectedClipImage = ref<ClipImageType | null>(null);
const exportFileInput = ref<HTMLInputElement>();

const { importClipImages } = useImportClipImages(clipImages);
const { exportClipImages } = useExportClipImages();

onMounted(() => {
	clipImages.value = JSON.parse(localStorage.getItem('images') || '[]');
});

const filteredClipImages = computed(() => {
	const searchTerm = searchClipImages.value?.toLowerCase() || '';
	return clipImages.value.filter((image) =>
		image.keywords.join(' ').toLowerCase().includes(searchTerm)
	);
});

function deleteClipImage(image: ClipImageType) {
	clipImages.value = clipImages.value.filter((img) => img.id !== image.id);
	localStorage.setItem('images', JSON.stringify(clipImages.value));
}
</script>

<template>
	<div class="bg-neutral-900 p-8 w-full">
		<div class="flex justify-between items-center bg-neutral-800 rounded-xl shadow-md p-4 mb-6">
			<div class="text-white text-2xl font-bold tracking-tight">Clipcord</div>
			<div class="relative w-full max-w-sm items-center">
				<Input
					v-model="searchClipImages"
					type="text"
					placeholder="Search..."
					class="pr-10"
				/>
				<span class="absolute end-0 inset-y-0 flex items-center justify-center px-2">
					<X
						@click="searchClipImages = ''"
						class="size-6 text-muted-foreground cursor-pointer"
					/>
				</span>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="col-start-1 col-span-2 bg-neutral-800 rounded-lg">
				<div class="flex justify-between items-center">
					<div class="p-4">
						<SlidingToggleGroup v-model="clipMode" type="single">
							<SlidingToggleGroupItem
								:disabled="clipMode === ClipMode.COPY"
								:value="ClipMode.COPY"
								aria-label="Copy mode"
							>
								<Copy /> Copy mode
							</SlidingToggleGroupItem>
							<SlidingToggleGroupItem
								:disabled="clipMode === ClipMode.EDIT"
								:value="ClipMode.EDIT"
								aria-label="Edit mode"
							>
								<Pencil /> Edit mode
							</SlidingToggleGroupItem>
							<SlidingToggleGroupItem
								:disabled="clipMode === ClipMode.DELETE"
								:value="ClipMode.DELETE"
								aria-label="Delete mode"
							>
								<Trash /> Delete mode
							</SlidingToggleGroupItem>
						</SlidingToggleGroup>
					</div>
					<div class="p-4 flex gap-2">
						<div>
							<Button variant="outline" @click="exportFileInput?.click()"
								>Import</Button
							>
							<input
								ref="exportFileInput"
								type="file"
								accept=".json"
								class="hidden"
								@change="importClipImages"
							/>
						</div>
						<Button @click="exportClipImages(clipImages)" variant="outline"
							>Export</Button
						>
					</div>
				</div>
				<hr />
			</div>
			<div
				class="flex flex-col col-start-3 justify-center p-4 bg-neutral-800 rounded-lg w-150 max-w-150 h-60"
			>
				<EditClipImage :clipImages :selectedClipImage :clipMode />
			</div>
		</div>

		<div class="p-4 bg-neutral-800 rounded-lg mt-6">
			<div class="flex flex-wrap gap-1">
				<ClipImage
					v-for="(image, index) in filteredClipImages"
					:key="index"
					:image
					:clipMode
					@select-clip-image="(img) => (selectedClipImage = img)"
					@delete-clip-image="deleteClipImage"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
