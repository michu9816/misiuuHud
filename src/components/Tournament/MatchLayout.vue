<script setup>
import { computed, defineProps, ref } from "vue";
import { useTournamentStore } from "@/stores/tournament.js"

const tournamentStore = useTournamentStore();
const props = defineProps(["data"]);

const teams = ref(props.data?.teams);
const results = function(index){
    return tournamentStore.getTeamMatchStatistics(props.data?.match_id)[0]?.data?.rounds[index]?.round_stats?.Score?.replace(" / ", ":") || "-:-";
};
const followingTeamWin = function(index){
    const winner = tournamentStore.getTeamMatchStatistics(props.data?.match_id)[0]?.data?.rounds[index]?.round_stats?.Winner;
    return winner ? winner == tournamentStore.getSelectedTeamId() : undefined;
};
const selectedMaps = computed(()=>
{
    let array = [];
    const mapsList = props.data?.voting?.map?.entities;
    props.data?.voting?.map?.pick.forEach(obj => {
        const map = mapsList.find(maps => maps.guid == obj);
        array.push({
            name: map?.name || "TBD",
            image: map?.image_lg
        })
    })

    if(!array.length){
        array.push({
            name: "TBD",
            image: require('@/assets/img/maps/none.jpg')
        })
    }
    return array
})
const round = ref(props.data?.round)
</script>

<template>
    <!-- Access the state directly from the store -->
    <div class="box">
        <div class="time">Round {{ round }}</div>
        <div class="rounds">
            <div class="round" v-for="(selectedMap, index) in selectedMaps" :key="selectedMap.name">
            <div class="match">
                <div class="background" :style="['background-image:url(' + selectedMap.image + ')']"></div>
                <div class="team">{{ teams.faction1?.name }}</div>
                <div class="scoreBox">
                    <div class="score" :class="{
                        winner: followingTeamWin(index) === true,
                        loser: followingTeamWin(index) === false,
                    }">{{ results(index) }}</div>
                </div>
                <div class="team">{{ teams.faction2?.name }}</div>
            </div>
            <div class="map">{{ selectedMap.name }}</div>
        </div>
        </div>
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
    width: 160px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    color: white;
    padding: 5px 0;
    position: relative;
    overflow: hidden;
}
.rounds{
    display: flex;
    gap: 5px;
}

.team {
    padding: 5px 0;
}

.scoreBox {
    background: rgb(0 0 0 / 30%);
    margin: 5px;
    border-radius: 5px;
    padding: 5px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
}

.score {
    font-size: 40px;
    text-shadow: 0 0 5px #0000007a;
}
.score.winner{
    color: var(--color-text-ct-bright)
}
.score.loser{
    color: var(--color-text-t-bright)
}

.background {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    z-index: -1;
    opacity: 0.4;
    background-size: cover;
}
</style>

