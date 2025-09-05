<script setup lang="ts">
import type { ClipImage } from '@/types/clip-image';
import { defineProps } from 'vue';

defineProps<{
	image: ClipImage;
}>();
</script>

<template>
	<img class="max-h-fit" loading="lazy" :src="image.src" />
</template>
