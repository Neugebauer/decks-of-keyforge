import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"
import { auctionStore } from "./auctions/DeckListingStore"
import { cardStore } from "./cards/CardStore"
import { HttpConfig } from "./config/HttpConfig"
import { serverStatusStore } from "./config/ServerStatusStore"
import { TextConfig } from "./config/TextConfig"
import { sellerStore } from "./sellers/SellerStore"
import { statsStore } from "./stats/StatsStore"
import { userStore } from "./user/UserStore"
import { userDeckStore } from "./userdeck/UserDeckStore"

TextConfig.loadFonts()
HttpConfig.setupAxios()
serverStatusStore.checkIfUpdating()
userStore.loadLoggedInUser()
userDeckStore.findAllForUser()
auctionStore.findListingsForUser()
cardStore.loadAllCards()
statsStore.findGlobalStats()
sellerStore.findFeaturedSellers()

ReactDOM.render(<App/>, document.getElementById("root"))
