<template>
	<main>
    <RouterView />
  </main>
</template>

<script setup>
import {onMounted} from "vue";
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(()=>{
  const width = window.innerWidth;
  if (width < 600){
    router.push('/settings')
  }
})
</script>