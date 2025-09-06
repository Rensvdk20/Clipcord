<script setup lang="ts">
import { onMounted, ref } from 'vue';

import ClipImage from './components/clip-image/ClipImage.vue';
import type { ClipImage as ClipImageType } from './types/clipImage';
import EditClipImage from './components/clip-image/EditClipImage.vue';

import { ClipMode } from '@/types/clipMode';
import { Input } from '@/components/ui/input';
import ToggleGroup from './components/ui/toggle-group/ToggleGroup.vue';
import ToggleGroupItem from './components/ui/toggle-group/ToggleGroupItem.vue';

import { Copy, Pencil, Trash } from 'lucide-vue-next';
import Button from './components/ui/button/Button.vue';

const clipImages = ref<ClipImageType[]>([]);
const clipMode = ref<ClipMode>(ClipMode.COPY);

const selectedClipImage = ref<ClipImageType | null>(null);

onMounted(() => {
	clipImages.value = JSON.parse(localStorage.getItem('images') || '[]');
});
</script>

<template>
	<div class="bg-neutral-900 p-8 h-screen w-screen">
		<div class="bg-neutral-800 rounded-xl shadow-md p-4 mb-6 flex justify-between items-center">
			<div class="text-white text-2xl font-bold tracking-tight">Clipcord</div>
			<div class="flex gap-3">
				<Input placeholder="Search" class="w-64" />
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="col-start-1 col-span-2 bg-neutral-800 rounded-lg">
				<div class="flex justify-between items-center">
					<div class="p-4">
						<ToggleGroup v-model="clipMode" type="single">
							<ToggleGroupItem :value="ClipMode.COPY" aria-label="Copy mode">
								<Copy /> Copy mode
							</ToggleGroupItem>
							<ToggleGroupItem :value="ClipMode.EDIT" aria-label="Edit mode">
								<Pencil /> Edit mode
							</ToggleGroupItem>
							<ToggleGroupItem :value="ClipMode.DELETE" aria-label="Delete mode">
								<Trash /> Delete mode
							</ToggleGroupItem>
						</ToggleGroup>
					</div>
					<div class="p-4 flex gap-2">
						<Button variant="outline">Import</Button>
						<Button variant="outline">Export</Button>
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
					v-for="(image, index) in clipImages"
					:key="index"
					:image
					:clipMode
					@select-clip-image="(img) => (selectedClipImage = img)"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
