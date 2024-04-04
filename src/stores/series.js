import { defineStore } from "pinia";
import { ref } from "vue";

export const useSeriesStore = defineStore("series", () => {
	const type = ref('bo1');
	const completeType = ref('auto');
	const maps = ref([
		{name:'ancient', picked: undefined, order: 101},
	{name:'anubis', picked: undefined, order: 102},
	{name:'inferno', picked: undefined, order: 103},
	{name:'nuke', picked: undefined, order: 104},
	{name:'mirage', picked: undefined, order: 105},
	{name:'overpass', picked: undefined, order: 106},
	{name:'vertigo', picked: undefined, order: 107}])

	function setSeriesType(value) {
		return type.value = value
	}

	function getSeriesType() {
		return type.value
	}

	function setCompleteType(value) {
		return completeType.value = value
	}

	function getCompleteType() {
		return completeType.value
	}

	function getMaps(){
		return maps.value.sort((obj1,obj2) => obj1.order - obj2.order);
	}

	function pickMap(team,map){
		const selectedMap = maps.value.find(obj => obj.name == map);
		selectedMap.picked = team;
		selectedMap.order = maps.value.filter(obj => obj.picked !== undefined).length;
	}
	function reset(){
		maps.value.forEach((element,index) => {
			element.picked = undefined;
			element.order = index + 100;
		});
	}

	return { getSeriesType,setSeriesType,setCompleteType, getCompleteType, pickMap, getMaps,reset};
});
