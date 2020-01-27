import { clone, isEqual } from "lodash"
import { observable } from "mobx"
import * as React from "react"
import { log, prettyJson, Utils } from "../../config/Utils"
import { SortDirection } from "../../generic/SortDirection"
import { House } from "../../houses/House"
import { userStore } from "../../user/UserStore"
import { defaultSort } from "../selects/DeckSortSelect"
import { Constraint } from "./ConstraintDropdowns"

export class DeckFilters {

    static forSaleOrTrade = () => {
        const filters = new DeckFilters()
        filters.forSale = true
        return filters
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static rehydrateFromQuery = (queryObject: any): DeckFilters => {
        log.debug(`Rehydrating from : ${prettyJson(queryObject)}`)
        if (typeof queryObject.houses === "string") {
            queryObject.houses = [queryObject.houses]
        }
        log.debug(`Expansions is: ${queryObject.expansions}`)
        if (queryObject.expansions != null) {
            if (queryObject.expansions.constructor === Array) {
                queryObject.expansions = queryObject.expansions.map((expansion: string) => Number(expansion))
            } else {
                const expansionAsNumber = Number(queryObject.expansions)
                queryObject.expansions = [expansionAsNumber]
            }
        }
        if (queryObject.cards) {
            if (typeof queryObject.cards === "string") {
                queryObject.cards = [queryObject.cards]
            }
            queryObject.cards = queryObject.cards.map((forQuery: string) => {
                const lastIndexOf = forQuery.lastIndexOf("-")
                const secondPart = forQuery.substring(lastIndexOf + 1)
                const quantity = isNaN(Number(secondPart)) ? undefined : Number(secondPart)
                let house
                if (quantity == null) {
                    house = secondPart as House
                }
                return {
                    cardNames: forQuery.substring(0, lastIndexOf).split(cardSeparator),
                    quantity,
                    house
                }
            })
        }
        if (queryObject.constraints) {
            if (typeof queryObject.constraints === "string") {
                queryObject.constraints = [queryObject.constraints]
            }
            queryObject.constraints = queryObject.constraints.map((forQuery: string) => {
                const split = forQuery.split("-")
                let property = split[0]
                if (property === "askingPrice") {
                    // temp to fix these urls
                    property = "buyItNow"
                }
                return {
                    property,
                    cap: split[1],
                    value: Number(split[2])
                }
            })
        }
        if (queryObject.page) {
            queryObject.page = Number(queryObject.page)
        }
        if (queryObject.forSale != null) {
            queryObject.forSale = queryObject.forSale === "true"
        }
        if (queryObject.notForSale != null) {
            queryObject.notForSale = queryObject.notForSale === "true"
        }
        if (queryObject.forTrade != null) {
            queryObject.forTrade = queryObject.forTrade === "true"
        }
        if (queryObject.forAuction != null) {
            queryObject.forAuction = queryObject.forAuction === "true"
        }
        if (queryObject.completedAuctions != null) {
            queryObject.completedAuctions = queryObject.completedAuctions === "true"
        }
        if (queryObject.registered != null) {
            queryObject.registered = queryObject.registered === "true"
        }
        if (queryObject.myFavorites != null) {
            queryObject.myFavorites = queryObject.myFavorites === "true"
        }
        if (queryObject.withOwners != null) {
            queryObject.withOwners = queryObject.withOwners === "true"
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filters = new DeckFilters() as any
        Object.keys(queryObject).forEach(key => filters[key] = queryObject[key])
        // log.debug(`Rehydrated to: ${prettyJson(filters)}`)
        return filters
    }

    houses: House[] = []
    @observable
    title = ""
    @observable
    notes = ""
    @observable
    notesUser = ""
    page = 0
    @observable
    sort: string = defaultSort.value
    @observable
    forSale?: boolean
    @observable
    notForSale = false
    @observable
    forTrade = false
    @observable
    forAuction = false
    @observable
    withOwners = false
    @observable
    completedAuctions = false
    @observable
    forSaleInCountry?: string
    @observable
    registered?: boolean
    @observable
    myFavorites = false
    constraints: Constraint[] = []
    expansions: number[] = []
    @observable
    cards: DeckCardQuantity[] = []
    @observable
    sortDirection: SortDirection = "DESC"
    @observable
    owner = ""
    pageSize = 20

    reset = () => {
        log.debug("Reseting deck filters.")
        this.title = ""
        this.notes = ""
        this.notesUser = ""
        this.forSale = undefined
        this.notForSale = false
        this.forTrade = false
        this.forAuction = false
        this.completedAuctions = false
        this.forSaleInCountry = undefined
        this.myFavorites = false
        this.registered = undefined
        this.cards = []
        this.expansions = []
        this.constraints = []
        this.sortDirection = "DESC"
        this.owner = ""
        this.withOwners = false
    }

    handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.title = event.target.value
    handleNotesUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.notes = event.target.value
        this.notesUser = userStore.username == null ? "" : userStore.username
    }
    removeNotes = () => {
        this.notesUser = ""
        this.notes = ""
    }
    handleMyDecksUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const username = userStore.username
            this.owner = username ? username : ""
        } else {
            this.owner = ""
        }
    }
    handleMyFavoritesUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.myFavorites = event.target.checked
        if (this.myFavorites) {
            const username = userStore.username
            this.owner = username ? username : ""
        }
    }

    handleCompletedAuctionsUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.completedAuctions = event.target.checked
        this.forSale = undefined
        this.forTrade = false
        this.forAuction = false
    }

    cleaned = () => {
        const cloned = clone(this)
        cloned.cards = cloned.cards.filter(card => card.cardNames.length > 0 && card.cardNames[0].length > 0)
        return cloned
    }
}

export const prepareDeckFiltersForQueryString = (filters: DeckFilters): DeckFilters => {
    const copied = Utils.jsonCopy(filters)

    Object.keys(copied).forEach((key: string) => {
        if (isEqual(copied[key], DefaultDeckFilters[key])) {
            delete copied[key]
        }
    })

    if (copied.forSaleInCountry == null || copied.forSaleInCountry === "") {
        delete copied.forSaleInCountry
    }

    if (copied.cards) {
        copied.cards = copied.cards.filter((card: DeckCardQuantity) => card.cardNames != null && card.cardNames[0] != null && card.cardNames[0].length > 0)
        copied.cards = cardsAsParam(copied.cards)
    }
    if (copied.constraints) {
        copied.constraints = constraintsAsParam(copied.constraints)
    }
    return copied
}

const constraintsAsParam = (constraints: Constraint[]) => (
    constraints.map(constraint => `${constraint.property}-${constraint.cap}-${constraint.value}`)
)

const cardsAsParam = (cards: DeckCardQuantity[]) => (
    cards.map(card => `${card.cardNames.join(cardSeparator)}-${card.house ? card.house : card.quantity}`)
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DefaultDeckFilters: any = new DeckFilters()

export interface DeckCardQuantity {
    cardNames: string[]
    quantity: number
    house?: House
}

export const cardSeparator = "~or~"
