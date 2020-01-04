import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { messageStore } from "../../ui/MessageStore"
import { AuctionDto } from "../AuctionDto"
import { MyOffers } from "./MyOffers"
import { MakeOffer, OfferStatus } from "./Offer"

export class OfferStore {

    static readonly SECURE_CONTEXT = HttpConfig.API + "/offers/secured"

    @observable
    auctionInfo?: AuctionDto

    @observable
    myOffers?: MyOffers

    @observable
    loadingMyOffers = false

    @observable
    hasOffersToView = false

    makeOffer = (deckName: string, makeOffer: MakeOffer) => {
        axios.post(`${OfferStore.SECURE_CONTEXT}/make-offer`, makeOffer)
            .then(() => {
                messageStore.setSuccessMessage(`Offer sent for ${deckName}.`)
            })
    }

    loadMyOffers = (statuses: OfferStatus[]) => {
        this.loadingMyOffers = true
        axios.post(`${OfferStore.SECURE_CONTEXT}/my-offers`, statuses)
            .then((response: AxiosResponse<MyOffers>) => {
                this.loadingMyOffers = false
                this.myOffers = response.data
            })
    }

    loadHasOffersToView = () => {
        axios.get(`${OfferStore.SECURE_CONTEXT}/has-offers-to-view`)
            .then((response: AxiosResponse<boolean>) => {
                this.hasOffersToView = response.data
            })
    }

    cancelOffer = (offerId: string) => {
        axios.post(`${OfferStore.SECURE_CONTEXT}/cancel/${offerId}`)
            .then((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    messageStore.setSuccessMessage(`Your offer has been cancelled`)
                } else {
                    messageStore.setWarningMessage("Your offer couldn't be cancelled as it was already accepted.")
                }
            })
    }

}

export const offerStore = new OfferStore()
