<template>
    <div class="body">
        <div class="settings tab">
            <div class="title">Settings</div>
            <div class="content">
                <div class="item">Series settings
                    <div class="options">
                        <div class="option" :class="{selected:seriesType==undefined}" @click="seriesStore.setSeriesType(undefined)">N/D</div>
                        <div class="option" :class="{selected:seriesType=='bo1'}" @click="seriesStore.setSeriesType('bo1')">BO1</div>
                        <div class="option" :class="{selected:seriesType=='bo3'}" @click="seriesStore.setSeriesType('bo3')">BO3</div>
                    </div>
                </div>
                <div class="item">Score completing
                    <div class="options">
                        <div class="option" :class="{selected: completeType == 'auto'}" @click="seriesStore.setCompleteType('auto')">Auto</div>
                        <div class="option" :class="{selected: completeType == 'manual'}" @click="seriesStore.setCompleteType('manual')">Manual</div>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="veto tab" v-if="seriesType == 'bo3'">
            <div class="title">Maps <span style="float: right;" @click="seriesStore.reset()">Reset</span></div>
            <div class="content">

            <div class="teams">
                <div class="team ct">Team 1</div>
                <div class="team t">Team 1</div>
            </div>

            <div class="map">
                <div>Pick</div>
                <div>Score</div>
                <div>Map</div>
                <div>Score</div>
                <div>Pick</div>
            </div>
            <div class="map list" v-for="map in maps" :key="map" :class="{disabled: !map.picked && maps.filter(obj => obj.picked && obj.order).length > 2}">
                <div class="pick" :class="[map.picked == 'ct' && map.order < 3 ? 'ct' : '',{disabled: map.picked && map.picked != 'ct' || map.order == 3}]" @click="pickMap('ct',map.name)">PICK</div>
                <div><input/></div>
                <div>{{map.name}}</div>
                <div><input/></div>
                <div class="pick" :class="[map.picked == 't' && map.order < 3 ? 't' : '',{disabled: map.picked && map.picked != 't' || map.order == 3}]" @click="pickMap('t',map.name)">PICK</div>
            </div>

        </div>
        {{ teams }}
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue";
import {useSeriesStore} from "@/stores/series.js";
import { useMatchStore } from "@/stores/match";

const seriesStore = useSeriesStore();
const matchStore = useMatchStore();

const seriesType = computed(()=>{
    return seriesStore.getSeriesType();
})
const completeType = computed(()=>{
    return seriesStore.getCompleteType();
})

const teams = computed(()=>{
    return matchStore.getScore()?.teams;
})

const pickMap = function(team,map) {
    seriesStore.pickMap(team,map)
}

const maps = computed(()=>{
    return seriesStore.getMaps();
})
</script>

<style scoped>
.body{
    background: var(--color-background-gray);
    color:white;
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    text-align: left;
    padding: 10px;
    display: grid;
    grid-gap: 10px;
}
.tab{
    border: 1px solid rgba(0,0,0,0.5);
    background: rgba(0,0,0,0.5);
    border-radius: 5px;
    padding: 5px 10px;
}
.tab .title{
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 5px;
    margin-bottom: 5px;
    font-size: 20px;
}
.item{
    margin-bottom: 10px;
}
.options{
    display: flex;
    gap: 10px;
    margin-top: 5px
}
.options .option{
    background: rgba(255,255,255,0.2);
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    transition-duration: 0.5s;
}
.options .option.selected{
    background: var(--color-background-ct);
}
.veto .map{
    display: grid;
    grid-template-columns: 15% 15% 40% 15% 15%;
    text-align: center;
    margin-bottom: 5px;
}
.veto .map.list .pick{
    transition-duration: 0.5s;
    font-size: 12px;
    display: flex;
    background: var(--color-text-white);
    width: 40px;
    border-radius: 5px;
    cursor: pointer;
    color: black;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    width: 100%;
}
.veto .map.list .pick.t{
    background: var(--color-text-t);
    color: white;
}
.veto .map.list .pick.ct{
    background: var(--color-text-ct);
    color: white;
}
.veto .map.list:not(:hover) .pick:not(.t,.ct){
    opacity: 0;
}
.veto .map input{
    width: 60%;
    background: none;
    color: white;
}
.teams{
    display: grid;
    grid-template-columns: 50% 50%;
    font-size: 24px;
    margin-bottom: 10px;
    text-align: center;
}
.team.t{
    color:var(--color-text-t-bright)
}
.team.ct{
    color:var(--color-text-ct-bright)
}
.disabled{
    filter: grayscale(1);
    opacity: 0.3;
}
</style>