import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSeriesStore = defineStore('series', () => {
	const type = ref(undefined);
	const showRadar = ref(false);
	const completeType = ref('manual');
	const maps = ref([
		{
			name: 'ancient',
			picked: undefined,
			order: 101,
			scores: [
				{
					team: undefined,
					points: undefined,
				},
				{
					team: undefined,
					points: undefined,
				},
			],
		},
		{
			name: 'anubis',
			picked: undefined,
			order: 102,
			scores: [
				{
					team: undefined,
					points: undefined,
				},
				{
					team: undefined,
					points: undefined,
				},
			],
		},
		{
			name: 'dust2',
			picked: undefined,
			order: 103,
			scores: [
				{
					team: undefined,
					points: undefined,
				},
				{
					team: undefined,
					points: undefined,
				},
			],
		},
		{
			name: 'inferno',
			picked: undefined,
			order: 104,
			scores: [
				{
					team: undefined,
					points: undefined,
				},
				{
					team: undefined,
					points: undefined,
				},
			],
		},
		{
			name: 'nuke',
			picked: undefined,
			order: 105,
			scores: [
				{
					team: undefined,
					points: undefined,
				},
				{
					team: undefined,
					points: undefined,
				},
			],
		},
		{
			name: 'mirage',
			picked: undefined,
			order: 106,
			scores: [
				{
					team: undefined,
					points: undefined,
				},
				{
					team: undefined,
					points: undefined,
				},
			],
		},
		{
			name: 'overpass',
			picked: undefined,
			order: 107,
			scores: [
				{
					team: undefined,
					points: undefined,
				},
				{
					team: undefined,
					points: undefined,
				},
			],
		},
		{
			name: 'vertigo',
			picked: undefined,
			order: 108,
			scores: [
				{
					team: undefined,
					points: undefined,
				},
				{
					team: undefined,
					points: undefined,
				},
			],
		},
	]);

	function setSeriesType(value) {
		return (type.value = value);
	}

	function getSeriesType() {
		return type.value;
	}

	function setCompleteType(value) {
		return (completeType.value = value);
	}

	function getCompleteType() {
		return completeType.value;
	}

	function getMaps() {
		return maps.value.sort((obj1, obj2) => obj1.order - obj2.order);
	}

	function pickMap(team, map) {
		const selectedMap = maps.value.find((obj) => obj.name == map);
		selectedMap.picked = team;
		selectedMap.order = maps.value.filter((obj) => obj.picked !== undefined).length;
	}
	function reset() {
		maps.value.forEach((element, index) => {
			element.picked = undefined;
			element.order = index + 100;
			element.scores = [
				{
					team: undefined,
					points: undefined,
				},
				{
					team: undefined,
					points: undefined,
				},
			];
		});
	}

	function refreshScores(data) {
		const mapsArray = JSON.parse(data);
		mapsArray.forEach((obj) => {
			const map = maps.value.find((map) => map.name == obj.name);
			map.scores = obj.scores;
		});
	}

	function setRadarStatus(value) {
		showRadar.value = value;
	}

	function getRadarStatus() {
		return showRadar.value;
	}

	return { setRadarStatus, getRadarStatus, refreshScores, getSeriesType, setSeriesType, setCompleteType, getCompleteType, pickMap, getMaps, reset };
});
