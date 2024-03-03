import { defineStore } from "pinia";
import { ref } from "vue";
import axios from 'axios';

export const useTournamentStore = defineStore("tournament", () => {
	const searchingTeamMatches = ref('ECSTATIC')
	const tournamentId = ref('bc28f1e0-b185-46b4-b32a-33ce79c8ac64')
	// const tournamentId = ref('03cca7ca-cea8-4e61-9e90-2c9c00d185ee')
	const key = ref('8eade652-61e6-4815-ab9a-c2d7bd6f0b6e')

	const matches = ref([]);
	const statistics = ref([]);
	const totalStatistics = ref([]);

	const selectedTeamId = ref();

	async function refreshTeamMatchesList(offset) {
		try {
			const response = await axios.get(`https://open.faceit.com/data/v4/championships/${tournamentId.value}/matches?offset=${offset || 0}&limit=${(offset || 0) + 100}`, { headers: { 'Authorization': `Bearer ${key.value}` } });
			const teamMatches = response.data?.items?.filter(obj => [obj.teams?.faction1?.name?.toUpperCase(), obj.teams?.faction2?.name?.toUpperCase()].includes(searchingTeamMatches.value?.toUpperCase())).sort((a, b) => a.round - b.round);

			teamMatches.forEach(match => {
				selectedTeamId.value = match?.teams?.faction1?.name?.toUpperCase() == searchingTeamMatches.value.toUpperCase() ? match?.teams?.faction1?.faction_id : match?.teams?.faction2?.faction_id
				if (matches.value.findIndex(matchFromList => matchFromList.match_id == match.match_id) == -1) {
					matches.value.push(match);
					refreshTeamMatcheStatistics(match.match_id)
				}
			})
		} catch (error) {
			console.log("Tu błąd jest")
			console.error(error);
		}
	}

	async function refreshTeamMatcheStatistics(matchId) {
		try {
			const response = await axios.get(`https://open.faceit.com/data/v4/matches/${matchId}/stats`, { headers: { 'Authorization': `Bearer ${key.value}` } });
			const matchStatistics = response.data;

			if (statistics.value.findIndex(statisticsFromList => statisticsFromList.match == matchId) == -1) {
				statistics.value.push({
					match: matchId,
					data: matchStatistics
				});
				console.log(matchStatistics)
				matchStatistics.rounds.forEach((stat,round)=>{
					console.log(stat,round)
					stat.teams.forEach(team => {
						console.log(team)
						if(team.team_id !== selectedTeamId.value){
							return;
						}
						team.players.forEach(player=>{
							totalStatistics.value.push({
								match: matchId,
								round: round,
									player: player.player_id,
									nick: player.nickname,
									stats: player.player_stats,
									team: team.team_id
							})
						})
					})
				})
			}else{
				statistics.value.find(statisticsFromList => statisticsFromList.match == matchId).data = matchStatistics
			}
			console.log(matchStatistics)
			console.log(totalStatistics.value);
			// })
		} catch (error) {
			console.log("Tu błąd jest też")
			console.error(error);
		}
	}


	function getTournamentName() {
		return matches.value[0]?.competition_name;
	}

	function getTeamMatches() {
		return matches.value.sort((a, b) => a.round - b.round);
	}

	function getTeamMatchStatistics(match) {
		return statistics.value.filter(obj => match ? obj.match == match : true);
	}


	function getPlayersMatchStatistics(match) {
		return statistics.value.filter(obj => match ? obj.match == match : true)[0]?.data?.rounds[0].teams.find(obj => obj.team_id == selectedTeamId.value)?.players;
	}
	function getTotalStatistics() {
		return totalStatistics.value;
	}


	function getSelectedTeamName() {
		return searchingTeamMatches.value
	}
	function getSelectedTeamId() {
		return selectedTeamId.value
	}
	return {getTotalStatistics, getSelectedTeamId,getSelectedTeamName, getTournamentName, refreshTeamMatchesList, getPlayersMatchStatistics, refreshTeamMatcheStatistics, getTeamMatches, getTeamMatchStatistics };
});
