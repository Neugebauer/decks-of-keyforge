package coraythan.keyswap.keyforgeevents.tournaments

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class TournamentResults(
        val pairingId: Long,
        val playerOneWon: Boolean,
        val playerOneKeys: Int,
        val playerTwoKeys: Int,
)
