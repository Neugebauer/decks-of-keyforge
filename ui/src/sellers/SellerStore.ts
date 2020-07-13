import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { deckListingStore } from "../auctions/DeckListingStore"
import { HttpConfig } from "../config/HttpConfig"
import { UpdatePrice } from "../generated-src/UpdatePrice"
import { messageStore } from "../ui/MessageStore"
import { SellerDetails } from "./SellerDetails"

export class SellerStore {

    static readonly CONTEXT = HttpConfig.API + "/sellers"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/sellers/secured"

    @observable
    featuredSellers?: SellerDetails[] = undefined

    updatePrices = (prices: UpdatePrice[]) => {
        axios.post(`${SellerStore.SECURE_CONTEXT}/update-prices`, prices)
            .then(() => {
                messageStore.setSuccessMessage(`Updated prices for ${prices.length} decks.`)
                deckListingStore.findListingsForUser(true)
            })
    }

    findFeaturedSellers = () => {
        axios.get(SellerStore.CONTEXT + "/featured")
            .then((response: AxiosResponse) => {
                this.featuredSellers = response.data
            })
    }

    findSellerWithUsername = (username: string) => {
        const sellers = this.featuredSellers
        if (sellers == null) {
            return undefined
        }
        const matches = sellers.filter(seller => seller.username === username)
        if (matches.length === 0) {
            return undefined
        }
        return matches[0]
    }

}

export const sellerStore = new SellerStore()
