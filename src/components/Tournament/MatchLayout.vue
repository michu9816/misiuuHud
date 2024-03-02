<script setup>
import { computed, defineProps, ref } from "vue";
import { useTournamentStore } from "@/stores/tournament.js"

const tournamentStore = useTournamentStore();
const props = defineProps(["data"]);

const teams = ref(props.data?.teams);
const results = computed(() => {
    console.log(tournamentStore.getTeamMatchStatistics(props.data?.match_id)[0]?.data?.rounds[0]);
    return tournamentStore.getTeamMatchStatistics(props.data?.match_id)[0]?.data?.rounds[0]?.round_stats?.Score?.replace(" / ", ":") || "-:-";
});
const selectedMap = ref({
    name: props.data?.voting?.map?.pick[0] || "TBD",
    image: props.data?.voting?.map?.entities.find(obj => obj.game_map_id == props.data?.voting?.map?.pick)?.image_lg
})
const round = ref(props.data?.round)
</script>

<template>
    <!-- Access the state directly from the store -->
    <div class="box">
        <div class="time">Round {{ round }}</div>
        <div class="match">
            <div class="background" :style="['background-image:url(' + selectedMap.image + ')']"></div>
            <div class="team">{{ teams.faction1?.name }}</div>
            <div class="scoreBox">
                <div class="score">{{ results }}</div>
            </div>
            <div class="team">{{ teams.faction2?.name }}</div>
        </div>
        <div class="map">{{ selectedMap.name }}</div>
    </div>
</template>

<style scoped>
.box {
    background: rgb(48 48 48 / 30%);
    border-radius: 5px;
}

.time,
.map {
    color: white;
    padding: 10px 0;
}

.match {
    width: 200px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    color: white;
    padding: 5px 0;
    position: relative;
    overflow: hidden;
}

.team {
    padding: 5px 0;
}

.scoreBox {
    background: rgba(255, 255, 255, 0.1);
    margin: 5px;
    border-radius: 5px;
    padding: 5px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.score {
    font-size: 40px;
}

.background {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    z-index: -1;
    filter: blur(4px);
    opacity: 0.4;
    background-size: cover;
}
</style>

