<script setup lang="ts">
import type { ClipImage } from '@/types/clip-image';
import { defineProps } from 'vue';

const props = defineProps<{
	image: ClipImage;
}>();

function copySrcToClipboard() {
	navigator.clipboard.writeText(props.image.src);
}
</script>

<template>
	<div
		class="p-2 hover:cursor-pointer hover:bg-neutral-700 rounded-lg"
		@click="copySrcToClipboard"
	>
		<img class="max-h-fit" loading="lazy" :src="props.image.src" />
	</div>
</template>
