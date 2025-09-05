<script setup lang="ts">
import { onMounted, ref } from 'vue';

import ClipImage from './components/ui/clip-image/ClipImage.vue';
import type { ClipImage as ClipImageType } from './types/clip-image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	TagsInput,
	TagsInputInput,
	TagsInputItem,
	TagsInputItemDelete,
	TagsInputItemText,
} from '@/components/ui/tags-input';

const clipImages = ref<ClipImageType[]>([]);
const keywords = ref<string[]>([]);

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
				<div class="p-4">t</div>
			</div>
			<div class="col-start-3 p-4 bg-neutral-800 rounded-lg w-150 max-w-150">
				<div class="grid grid-cols-2">
					<div>
						<div class="mb-4">
							<Input placeholder="Image URL" />
						</div>
						<div class="mb-4">
							<TagsInput v-model="keywords">
								<TagsInputItem v-for="item in keywords" :key="item" :value="item">
									<TagsInputItemText />
									<TagsInputItemDelete />
								</TagsInputItem>

								<TagsInputInput placeholder="Keywords" />
							</TagsInput>
						</div>
						<div>
							<Button class="w-full">Add</Button>
						</div>
					</div>
					<div class="flex justify-center items-center">
						<div class="h-30 w-30 bg-neutral-700 rounded-lg"></div>
					</div>
				</div>
			</div>
		</div>

		<div class="p-4 bg-neutral-800 rounded-lg mt-6">
			<div class="flex flex-wrap gap-1">
				<ClipImage v-for="(image, index) in clipImages" :key="index" :image />
			</div>
		</div>
	</div>
</template>

<style scoped></style>
