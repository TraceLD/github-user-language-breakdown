<script lang="ts">
    import Home from "./components/Home.svelte";
</script>

<main class="min-h-screen w-full font-body bg-gray-900">
    <!-- Additional component for the main app to cricumvent -->
    <!-- bad compile times with TailwindCSS when editing App.svelte -->
    <Home />
</main>

<style global>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
