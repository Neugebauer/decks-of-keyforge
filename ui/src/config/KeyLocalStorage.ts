import { observable } from "mobx"
import { log } from "./Utils"

class KeyLocalStorage {

    @observable
    showTableView: boolean

    @observable
    showFullCardView: boolean

    @observable
    deckPageSize: number = 20

    private localStorage = window.localStorage

    constructor() {
        const value = this.showDeckTableViewFromStorage()
        this.showTableView = Boolean(value)
        this.showFullCardView = Boolean(this.showFullCardViewFromStorage())
        this.deckPageSizeFromStorage()
    }

    saveAuthKey = (token: string) => this.localStorage.setItem(Keys.AUTH, token)
    findAuthKey = (): string | undefined => {
        const key = this.localStorage.getItem(Keys.AUTH)
        if (key === null) {
            log.debug("No auth key in local storage.")
            return undefined
        }
        log.debug("Found auth key in local storage.")
        return key
    }

    toggleDeckTableView = () => {
        const newValue = !this.showTableView
        this.showTableView = newValue
        this.localStorage.setItem(Keys.DECK_TABLE_VIEW, String(newValue))
    }
    showDeckTableViewFromStorage = () => {
        const showTableView = this.localStorage.getItem(Keys.DECK_TABLE_VIEW)
        return showTableView === "true"
    }

    toggleFullCardView = () => {
        const newValue = !this.showFullCardView
        this.showFullCardView = newValue
        this.localStorage.setItem(Keys.FULL_CARD_VIEW, String(newValue))
    }
    showFullCardViewFromStorage = () => {
        const showFullCardView = this.localStorage.getItem(Keys.FULL_CARD_VIEW)
        return showFullCardView === "true"
    }

    setDeckPageSize = (size: number) => {
        this.deckPageSize = size
        this.localStorage.setItem(Keys.DECK_PAGE_SIZE, size.toString())
    }

    deckPageSizeFromStorage = () => {
        const deckPageSizeString = this.localStorage.getItem(Keys.DECK_PAGE_SIZE)
        const deckPageSize = Number(deckPageSizeString)
        if (deckPageSize > 0) {
            this.deckPageSize = deckPageSize
        }
    }

    clear = () => {
        log.debug("Clearing local storage.")
        this.localStorage.clear()
    }

}

enum Keys {
    AUTH = "AUTH",
    DECK_TABLE_VIEW = "DECK_TABLE_VIEW",
    FULL_CARD_VIEW = "FULL_CARD_VIEW",
    DECK_PAGE_SIZE = "DECK_PAGE_SIZE"
}

export const keyLocalStorage = new KeyLocalStorage()
