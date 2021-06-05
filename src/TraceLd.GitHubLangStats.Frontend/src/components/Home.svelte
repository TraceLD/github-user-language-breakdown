<script lang="ts">
    import Header from './Header.svelte';
    import Input from './Input.svelte';

    let gitHubName: string;
    let isOrg: boolean;
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
    <Header />
    <div class="mt-4">
        <Input bind:gitHubName bind:isOrg />
    </div>
</div>
