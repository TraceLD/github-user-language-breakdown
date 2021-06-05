<script lang="ts">
    import UserIcon from '../icons/UserIcon.svelte';
    import OrganisationIcon from '../icons/OrganisationIcon.svelte';

    export let gitHubName: string = '';
    export let isOrg: boolean = false;
</script>

<div class="flex flex-col gap-y-2 md:gap-y-0 md:flex-row items-center">
    <input
        type="text"
        name="githubName"
        id="githubName"
        class="md:mr-2 h-11 w-72 rounded bg-gray-800 text-center text-gray-100 border-gray-500 focus:ring-2 focus:ring-blue-600"
        placeholder={isOrg ? 'Enter GitHub Organisation Name' : 'Enter GitHub Username'}
        bind:value={gitHubName}
    />

    <div class="flex items-center">
        <div
            class="flex items-center h-11 w-20 bg-gray-800 rounded border border-gray-500 focus:outline-none"
        >
            <button
                class:bg-blue-500={!isOrg}
                class:text-gray-100={!isOrg}
                class:text-gray-600={isOrg}
                class="flex items-center justify-center ml-1 my-1 h-9 w-9 rounded focus:outline-none"
                on:click={() => (isOrg = false)}
            >
                <UserIcon />
            </button>
            <button
                class:bg-blue-500={isOrg}
                class:text-gray-100={isOrg}
                class:text-gray-600={!isOrg}
                class="flex items-center justify-center mr-1 my-1 h-9 w-9 rounded focus:outline-none"
                on:click={() => (isOrg = true)}
            >
                <OrganisationIcon />
            </button>
        </div>

        <button
            class="ml-2 h-11 w-16 bg-gray-800 rounded border border-gray-500 text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:border-transparent"
        >
            Go
        </button>
    </div>
</div>
