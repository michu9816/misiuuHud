<script setup>
import { computed } from 'vue';
import { useMatchStore } from '@/stores/match';
// import { useSeriesStore } from '@/stores/series';
import { usePlayersStore } from '@/stores/players';

import MoneyInformation from '@/components/Bottom/Money/MoneyInformation.vue';

const matchStore = useMatchStore();
const playerStore = usePlayersStore();

const score = computed(() => {
	const show = matchStore.getPhase().round == 'freezetime' && matchStore.getScore().round > 1;

	return {
		show,
	};
});

const lossBonus = computed(() => {
	let lossBonusCT = matchStore.getLossBonus('ct');
	let lossBonusT = matchStore.getLossBonus('t');
	return [
		{ value: 1400 + 500 * lossBonusCT, steps: lossBonusCT },
		{ value: 1400 + 500 * lossBonusT, steps: lossBonusT },
	];
});

const equipment = computed(() => {
	const moneyCT = playerStore.getPlayers('ct').reduce((accumulator, currentValue) => {
		return accumulator + currentValue.state.equip_value;
	}, 0);
	const moneyT = playerStore.getPlayers('t').reduce((accumulator, currentValue) => {
		return accumulator + currentValue.state.equip_value;
	}, 0);

	return [
		{
			value: moneyCT,
			steps: getEquipmentSteps(moneyCT),
		},
		{
			value: moneyT,
			steps: getEquipmentSteps(moneyT),
		},
	];

	function getEquipmentSteps(value) {
		if (value < 1500) {
			return 0;
		} else {
			return parseInt(value / 6250);
		}
	}
});
</script>
<template>
	<div class="box" v-if="score.show">
		<div class="informations">
			<MoneyInformation name="Loss Bonus" :values="lossBonus" />
			<MoneyInformation name="Equipment" :values="equipment" />
		</div>
	</div>
</template>

<style scoped>
.box {
	display: flex;
	justify-content: center;
	color: white;
	animation: fadeIn 0.5s;
	position: absolute;
	left: calc(50% - 125px);
	bottom: 10px;
}
.informations {
	background: black;
	border-radius: 5px;
	margin-top: 5px;
	width: 240px;
	padding: 10px 5px;
	display: grid;
	grid-gap: 10px;
}

@keyframes fadeIn {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>
