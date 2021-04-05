package coraythan.keyswap.decks.models

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.*
import coraythan.keyswap.auctions.DeckListing
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.keyforgeevents.tournamentdecks.TournamentDeck
import coraythan.keyswap.stats.DeckStatistics
import coraythan.keyswap.synergy.DeckSynergyInfo
import coraythan.keyswap.synergy.SynTraitPlayer
import coraythan.keyswap.synergy.SynergyTrait
import coraythan.keyswap.synergy.containsTrait
import coraythan.keyswap.tags.DeckTag
import coraythan.keyswap.userdeck.*
import org.hibernate.annotations.Type
import java.time.LocalDate
import java.time.ZonedDateTime
import javax.persistence.*

@Entity
data class Deck(

        @Column(unique = true)
        val keyforgeId: String,

        val name: String,
        val expansion: Int,
        val powerLevel: Int = 0,
        val chains: Int = 0,
        val wins: Int = 0,
        val losses: Int = 0,

        val anomalyCount: Int? = 0,
        val maverickCount: Int = 0,
        val specialsCount: Int = 0,
        val raresCount: Int = 0,
        val uncommonsCount: Int = 0,

        val rawAmber: Int = 0,
        val totalPower: Int = 0,
        val bonusDraw: Int? = 0,
        val bonusCapture: Int? = 0,
        val creatureCount: Int = 0,
        val actionCount: Int = 0,
        val artifactCount: Int = 0,
        val upgradeCount: Int = 0,
        val totalArmor: Int = 0,

        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double = 0.0,
        val efficiency: Double = 0.0,
        val recursion: Double? = 0.0,
        val effectivePower: Int = 0,
        val creatureProtection: Double? = 0.0,
        val disruption: Double = 0.0,
        val other: Double = 0.0,
        val aercScore: Double = 0.0,
        val previousSasRating: Int? = 0,
        val previousMajorSasRating: Int? = 0,
        val aercVersion: Int? = 0,
        val sasRating: Int = 0,
        val synergyRating: Int = 0,
        val antisynergyRating: Int = 0,

        val forSale: Boolean = false,
        val forTrade: Boolean = false,
        val forAuction: Boolean = false,
        val completedAuction: Boolean = false,
        val wishlistCount: Int = 0,
        val funnyCount: Int = 0,

        // Json of card ids for performance loading decks, loading cards from cache
        @Lob
        @Type(type = "org.hibernate.type.TextType")
        val cardIds: String = "",

        val cardNames: String = "",

        val houseNamesString: String = "",

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
        val userDecks: List<UserDeck> = listOf(),

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
        val tournamentDecks: List<TournamentDeck> = listOf(),

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
        val ownedDecks: List<OwnedDeck> = listOf(),

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
        val funnyDecks: List<FunnyDeck> = listOf(),

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
        val favoritedDecks: List<FavoritedDeck> = listOf(),

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
        val previouslyOwnedDecks: List<PreviouslyOwnedDeck> = listOf(),

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
        val tags: List<DeckTag> = listOf(),

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY)
        val auctions: List<DeckListing> = listOf(),

        val hasOwnershipVerification: Boolean? = false,

        val listedOn: ZonedDateTime? = null,
        val auctionEnd: ZonedDateTime? = null,
        val auctionEndedOn: ZonedDateTime? = null,

        val importDateTime: ZonedDateTime? = now(),

        /**
         * Last SAS update
         */
        val lastUpdate: ZonedDateTime? = now(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
) {

    val expansionEnum: Expansion
        get() = Expansion.forExpansionNumber(expansion)

    val houses: List<House>
        get() = this.houseNamesString.split("|").map { House.valueOf(it) }

    val dateAdded: LocalDate?
        get() = this.importDateTime?.toLocalDate()

    fun ratingsEqual(o: Deck) = this.amberControl == o.amberControl &&
            this.expectedAmber == o.expectedAmber &&
            this.artifactControl == o.artifactControl &&
            this.creatureControl == o.creatureControl &&
            this.effectivePower == o.effectivePower &&
            this.efficiency == o.efficiency &&
            this.recursion == o.recursion &&
            this.disruption == o.disruption &&
            this.creatureProtection == o.creatureProtection &&
            this.other == o.other &&
            this.sasRating == o.sasRating &&
            this.aercScore == o.aercScore


    fun toDeckSearchResult(
            housesAndCards: List<HouseAndCards>? = null,
            cards: List<Card>? = null,
            stats: DeckStatistics? = null,
            synergies: DeckSynergyInfo? = null,
            includeDetails: Boolean = false
    ): DeckSearchResult {
        return DeckSearchResult(
                id = id,
                keyforgeId = keyforgeId,
                expansion = expansionEnum,
                name = name,

                powerLevel = powerLevel.zeroToNull(),
                chains = chains.zeroToNull(),
                wins = wins.zeroToNull(),
                losses = losses.zeroToNull(),

                creatureCount = creatureCount.zeroToNull(),
                actionCount = actionCount.zeroToNull(),
                artifactCount = artifactCount.zeroToNull(),
                upgradeCount = upgradeCount.zeroToNull(),

                cardDrawCount = (cards?.filter {
                    it.extraCardInfo?.traits?.containsTrait(SynergyTrait.drawsCards) == true
                            || it.extraCardInfo?.traits?.containsTrait(SynergyTrait.increasesHandSize) == true
                }?.size ?: 0).zeroToNull(),
                cardArchiveCount = (cards?.filter { it.extraCardInfo?.traits?.containsTrait(SynergyTrait.archives, player = SynTraitPlayer.FRIENDLY) == true }?.size ?: 0).zeroToNull(),
                keyCheatCount = (cards?.filter { it.extraCardInfo?.traits?.containsTrait(SynergyTrait.forgesKeys) == true }?.size ?: 0).zeroToNull(),
                rawAmber = rawAmber,
                totalArmor = totalArmor.zeroToNull(),

                expectedAmber = synergies?.expectedAmber ?: expectedAmber,
                amberControl = synergies?.amberControl ?: amberControl,
                creatureControl = synergies?.creatureControl ?: creatureControl,
                artifactControl = (synergies?.artifactControl ?: artifactControl).zeroToNull(),
                efficiency = (synergies?.efficiency ?: efficiency).zeroToNull(),
                recursion = (synergies?.recursion ?: recursion).zeroToNull(),
                effectivePower = synergies?.effectivePower ?: effectivePower,
                creatureProtection = (synergies?.creatureProtection ?: creatureProtection).zeroToNull(),
                disruption = (synergies?.disruption ?: disruption).zeroToNull(),
                other = (synergies?.other ?: other).zeroToNull(),
                aercScore = synergies?.rawAerc ?: aercScore.toInt(),
                previousSasRating = previousSasRating ?: sasRating,
                previousMajorSasRating = previousMajorSasRating,
                aercVersion = aercVersion ?: 12,
                sasRating = synergies?.sasRating ?: sasRating,
                synergyRating = synergies?.synergyRating ?: synergyRating,
                antisynergyRating = synergies?.antisynergyRating ?: antisynergyRating,
                totalPower = totalPower,
                forSale = forSale.falseToNull(),
                forTrade = forTrade.falseToNull(),
                forAuction = forAuction.falseToNull(),
                wishlistCount = wishlistCount.zeroToNull(),
                funnyCount = funnyCount.zeroToNull(),
                housesAndCards = housesAndCards ?: listOf(),

                lastSasUpdate = lastUpdate?.toLocalDateWithOffsetMinutes(-420)?.toString().emptyToNull(),

                sasPercentile = stats?.sasStats?.percentileForValue?.get(synergies?.sasRating ?: sasRating)
                        ?: if (sasRating < 75) 0.0 else 100.0,

                synergyDetails = if (includeDetails) synergies?.synergyCombos else synergies?.synergyCombos?.map { it.copy(synergies = listOf()) },
                metaScores = synergies?.metaScores ?: mapOf(),
                efficiencyBonus = synergies?.efficiencyBonus ?: 0.0,

                hasOwnershipVerification = hasOwnershipVerification.falseToNull(),

                dateAdded = dateAdded,
        )
    }

    fun addGameStats(keyforgeDeck: KeyforgeDeck): Deck? {
        if (this.wins == keyforgeDeck.wins && this.losses == keyforgeDeck.losses
                && this.chains == keyforgeDeck.chains && this.powerLevel == keyforgeDeck.power_level) {
            return null
        }
        return this.copy(
                wins = keyforgeDeck.wins,
                losses = keyforgeDeck.losses,
                chains = keyforgeDeck.chains,
                powerLevel = keyforgeDeck.power_level
        )
    }

    fun withCards(newCardsList: List<Card>): Deck {
        if (newCardsList.size != 36) throw IllegalArgumentException("The cards list contained too many cards: ${newCardsList.size}")

        val cardNames = "~" +
                // Add the cards themselves
                newCardsList
                        .groupBy { it.cardTitle }
                        .map { entry ->
                            "${entry.key}${(1..entry.value.size).joinToString("")}"
                        }.sorted().joinToString("~") + "~" +
                // Add duplicates for mavericks with the house
                newCardsList
                        .filter { it.maverick && !it.anomaly }
                        .groupBy { it.cardTitle }
                        .flatMap { entry ->
                            entry.value
                                    .groupBy { it.house }
                                    .map { houseToCards ->
                                        val firstCard = houseToCards.value[0]
                                        "${firstCard.cardTitle}${firstCard.house}"
                                    }
                        }.sorted().joinToString("~") + "~" +
                // Add duplicates for anomalies with the house
                newCardsList
                        .filter { it.anomaly }
                        .groupBy { it.cardTitle }
                        .flatMap { entry ->
                            entry.value
                                    .groupBy { it.house }
                                    .map { houseToCards ->
                                        val firstCard = houseToCards.value[0]
                                        "${firstCard.cardTitle}${firstCard.house}"
                                    }
                        }.sorted().joinToString("~") + "~"

        return this.copy(
                cardNames = cardNames,
                rawAmber = newCardsList.map {
                    it.amber + (it.extraCardInfo?.enhancementAmber ?: 0)
                }.sum(),
                totalPower = newCardsList.map { it.power }.sum(),
                totalArmor = newCardsList.map { it.armor }.sum(),
                creatureCount = newCardsList.filter { it.cardType == CardType.Creature }.size,
                actionCount = newCardsList.filter { it.cardType == CardType.Action }.size,
                artifactCount = newCardsList.filter { it.cardType == CardType.Artifact }.size,
                upgradeCount = newCardsList.filter { it.cardType == CardType.Upgrade }.size,
                maverickCount = newCardsList.filter { it.maverick }.size,
                anomalyCount = newCardsList.filter { it.anomaly }.size,
                specialsCount = newCardsList.filter { it.rarity == Rarity.FIXED || it.rarity == Rarity.Variant || it.rarity == Rarity.Special }.size,
                raresCount = newCardsList.filter { it.rarity == Rarity.Rare }.size,
                uncommonsCount = newCardsList.filter { it.rarity == Rarity.Uncommon }.size
        )
    }

}

@JsonIgnoreProperties(ignoreUnknown = true)
data class DecksPage(
        val decks: List<DeckSearchResult>,
        val page: Long
)

data class DeckCount(
        val pages: Long,
        val count: Long
)
