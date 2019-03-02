import { clone, isEqual } from "lodash"
import { observable } from "mobx"
import * as React from "react"
import { log, prettyJson } from "../../config/Utils"
import { SortDirection } from "../../generic/SortDirection"
import { House } from "../../houses/House"
import { UserStore } from "../../user/UserStore"
import { defaultSort } from "../selects/DeckSortSelect"
import { Constraint } from "./ConstraintDropdowns"

export class DeckFilters {

    static rehydrateFromQuery = (queryObject: any): DeckFilters => {
        log.debug(`Rehydrating from : ${prettyJson(queryObject)}`)
        if (typeof queryObject.houses === "string") {
            queryObject.houses = [queryObject.houses]
        }
        if (queryObject.cards) {
            if (typeof queryObject.cards === "string") {
                queryObject.cards = [queryObject.cards]
            }
            queryObject.cards = queryObject.cards.map((forQuery: string) => {
                const split = forQuery.split("-")
                return {
                    cardName: split[0],
                    quantity: Number(split[1])
                }
            })
        }
        if (queryObject.constraints) {
            if (typeof queryObject.constraints === "string") {
                queryObject.constraints = [queryObject.constraints]
            }
            queryObject.constraints = queryObject.constraints.map((forQuery: string) => {
                const split = forQuery.split("-")
                return {
                    property: split[0],
                    cap: split[1],
                    value: Number(split[2])
                }
            })
        }
        if (queryObject.page) {
            queryObject.page = Number(queryObject.page)
        }
        if (queryObject.forSale) {
            queryObject.forSale = Boolean(queryObject.forSale)
        }
        if (queryObject.forTrade) {
            queryObject.forTrade = Boolean(queryObject.forTrade)
        }
        if (queryObject.includeUnregistered) {
            queryObject.includeUnregistered = Boolean(queryObject.includeUnregistered)
        }
        if (queryObject.myFavorites) {
            queryObject.myFavorites = Boolean(queryObject.myFavorites)
        }

        const filters = new DeckFilters() as any
        Object.keys(queryObject).forEach(key => filters[key] = queryObject[key])
        // log.debug(`Rehydrated to: ${prettyJson(filters)}`)
        return filters
    }

    private static constraintsAsParam = (constraints: Constraint[]) => (
        constraints.map(constraint => `${constraint.property}-${constraint.cap}-${constraint.value}`)
    )

    private static cardsAsParam = (cards: DeckCardQuantity[]) => (
        cards.map(card => `${card.cardName}-${card.quantity}`)
    )

    houses: House[] = []
    @observable
    title: string = ""
    page: number = 0
    @observable
    sort: string = defaultSort.value
    @observable
    forSale = false
    @observable
    forTrade = false
    @observable
    forSaleInCountry?: string
    @observable
    includeUnregistered = false
    @observable
    myFavorites: boolean = false
    constraints: Constraint[] = []
    @observable
    cards: DeckCardQuantity[] = [{
        cardName: "",
        quantity: 1
    }]
    @observable
    sortDirection: SortDirection = "DESC"
    @observable
    owner: string = ""
    pageSize = 20

    reset = () => {
        log.debug("Reseting deck filters.")
        this.title = ""
        this.forSale = false
        this.forTrade = false
        this.forSaleInCountry = undefined
        this.myFavorites = false
        this.includeUnregistered = false
        this.cards = [{
            cardName: "",
            quantity: 1
        }]
        this.constraints = []
        this.sortDirection = "DESC"
        this.owner = ""
    }

    handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.title = event.target.value
    handleMyDecksUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const username = UserStore.instance.username
            this.owner = username ? username : ""
        } else {
            this.owner = ""
        }
    }
    handleMyFavoritesUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.myFavorites = event.target.checked

    prepareForQueryString = (): DeckFilters => {
        const copied = JSON.parse(JSON.stringify(this))

        Object.keys(copied).forEach((key: string) => {
            if (isEqual(copied[key], DefaultDeckFilters[key])) {
                delete copied[key]
            }
        })

        if (copied.cards) {
            copied.cards = copied.cards.filter((card: DeckCardQuantity) => card.cardName.length > 0 && card.quantity > 0)
            copied.cards = DeckFilters.cardsAsParam(copied.cards)
        }
        if (copied.constraints) {
            copied.constraints = DeckFilters.constraintsAsParam(copied.constraints)
        }
        return copied
    }

    cleaned = () => {
        const cloned = clone(this)
        cloned.cards = cloned.cards.filter(card => card.cardName.length > 0 && card.quantity > 0)
        return cloned
    }
}

const DefaultDeckFilters: any = new DeckFilters()

export interface DeckCardQuantity {
    cardName: string
    quantity: number
}
