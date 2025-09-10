<script setup lang="ts">
import { ref, watch } from 'vue';

import type { ClipImage } from '@/types/clipImage';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import ToggleGroup from '@/components/ui/toggle-group/ToggleGroup.vue';
import ToggleGroupItem from '@/components/ui/toggle-group/ToggleGroupItem.vue';

const packFiles = import.meta.glob('@/assets/packs/*.json');

const packs = ref<Record<string, ClipImage[]>>({});
const packsLoaded = ref(false);

const selectedPack = ref<string>('cats');

const dialogOpen = ref(false);

watch(dialogOpen, async (open) => {
	if (open && !packsLoaded.value) {
		for (const path in packFiles) {
			const packName = path.split('/').pop()?.replace('.json', '') || 'unknown';
			const mod = (await packFiles[path]()) as { default: ClipImage[] };
			packs.value[packName] = mod.default;
		}

		packsLoaded.value = true;
	}
});
</script>

<template>
	<Dialog v-model:open="dialogOpen">
		<DialogTrigger as-child>
			<Button variant="outline">Packs</Button>
		</DialogTrigger>
		<DialogContent
			class="sm:max-w-[425px] md:max-w-[80vw] grid-rows-[auto_minmax(0,1fr)_auto] p-0 h-[90dvh]"
		>
			<DialogHeader class="p-6 pb-0">
				<DialogTitle>Packs</DialogTitle>
				<DialogDescription>Add clip images from packs to your library</DialogDescription>
			</DialogHeader>

			<div class="flex gap-4 overflow-y-auto px-6">
				<ToggleGroup v-model="selectedPack" class="flex-col max-h-fit" type="single">
					<ToggleGroupItem
						v-for="(clipImages, packName) in packs"
						:disabled="selectedPack === packName"
						:value="packName"
						class="w-full my-1 justify-normal"
						aria-label="Copy mode"
					>
						{{ packName }} <span class="text-gray-500">({{ clipImages.length }})</span>
					</ToggleGroupItem>
				</ToggleGroup>
				<div class="w-full">
					<div v-if="!packsLoaded" class="text-gray-500">Loading packs...</div>
					<div v-else>
						<div :key="selectedPack.toString()" class="space-y-4">
							<div class="flex flex-wrap gap-2">
								<img
									v-for="img in packs[selectedPack]"
									:key="img.src"
									:src="img.src"
									:alt="img.keywords.join(', ')"
									class="w-16 h-16 object-contain rounded cursor-pointer hover:scale-105 transition"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<DialogFooter class="p-6 pt-0">
				<Button type="submit">Save changes</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
