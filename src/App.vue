<template>
	<p>
    {{ $route.fullPath }}
    <RouterLink to="/settings">Go to About</RouterLink>
  </p>
	<main>
    <RouterView />
  </main>
</template>