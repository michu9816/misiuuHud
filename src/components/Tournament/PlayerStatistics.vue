<script setup>
import { defineProps, ref } from "vue";
// import { useTournamentStore } from "@/stores/tournament.js"

// const tournamentStore = useTournamentStore();
const props = defineProps(["data"]);

const player = ref(props.data)
</script>

<template>
    <!-- Access the state directly from the store -->
    <div class="box">
        <div class="title">
            Nickname
        </div>
        <div class="title">
            Kills
        </div>
        <div class="title">
            Deaths
        </div>
        <div class="title">
            Assists
        </div>
        <div class="title">
            HS%
        </div>
        <div class="title">
            K/R
        </div>
        <div>
            {{ player.nickname }}
        </div>
        <div>
            {{ player.player_stats["Kills"] }}
        </div>
        <div>
            {{ player.player_stats["Deaths"] }}
        </div>
        <div>
            {{ player.player_stats["Assists"] }}
        </div>
        <div>
            {{ player.player_stats["Headshots %"] }}
        </div>
        <div>
            {{ player.player_stats["K/R Ratio"] }}
        </div>
    </div>
</template>

<style scoped>
.box {
    background: rgb(48 48 48 / 30%);
    border-radius: 5px;
    display: grid;
    grid-template-columns: 320px 80px 80px 80px 80px 80px;
    padding: 10px;
    color:white;
    font-size: 24px;
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
.title{
    font-size: 14px;
    color: var(--color-text-ct-bright);
    margin-bottom: 5px;
}
</style>

