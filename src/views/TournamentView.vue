<template>
    <div class="tournamentOverlay">
        <div class="name">{{ tournamentName }}</div>
        <h2>Today's matches of the {{ selectedTeam }} team</h2>
        <div class="matches">
            <MatchLayout v-for="match in tournamentMatches" :data="match" :key="match?.match_id"></MatchLayout>
        </div>
        <h2>Tournament players statistics</h2>
        <div class="statistics">
            <PlayerStatistics v-for="match in tournamentPlayersStatistics" :data="match" :key="match?.match_id"></PlayerStatistics>
        </div>
        <div class="match">{{ tournamentName }}</div>

        <button @click="tournamentStore.refreshTeamMatchesList()">Test</button>
        {{ tournamentStatistics }}
    </div>
</template>

<script setup>
import { useTournamentStore } from "@/stores/tournament";
import MatchLayout from "@/components/Tournament/MatchLayout.vue";
import PlayerStatistics from "@/components/Tournament/PlayerStatistics.vue";
import { computed } from "vue";

const tournamentStore = useTournamentStore();
const tournamentMatches = computed(() => {
    return tournamentStore.getTeamMatches();
})
const tournamentStatistics = computed(() => {
    return tournamentStore.getTeamMatchStatistics();
})
const tournamentPlayersStatistics = computed(() => {
    return tournamentStore.getPlayersMatchStatistics();
})
const selectedTeam = computed(() => {
    return tournamentStore.getSelectedTeamName();
})

const tournamentName = computed(() => {
    return tournamentStore.getTournamentName();
})
</script>

<style scoped>
.tournamentOverlay {
    background: -webkit-radial-gradient(10% 20%, #00121f -10%, #060606);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    font-weight: normal;
}

.name {
    padding: 20px 0;
    font-size: 42px;
    color: white;
    margin: 20px;
}

h2 {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 20px;
    color: white;
}

.matches {
    display: flex;
    gap: 10px;
    justify-content: center;
}
.statistics{
    margin: auto;
    display: grid;
    grid-gap: 10px;
    width: 750px;
}
</style>

