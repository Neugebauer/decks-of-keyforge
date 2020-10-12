import { Box, Divider, FormGroup, IconButton, Link, Tooltip } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import List from "@material-ui/core/List/List"
import ListItem from "@material-ui/core/ListItem/ListItem"
import TextField from "@material-ui/core/TextField/TextField"
import Typography from "@material-ui/core/Typography"
import { BarChart, Close, Delete, ViewList, ViewModule } from "@material-ui/icons"
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab"
import * as History from "history"
import { computed, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { KeyDrawer, keyDrawerStore, KeyDrawerVersion } from "../../components/KeyDrawer"
import { SearchDrawerExpansionPanel } from "../../components/SearchDrawerExpansionPanel"
import { SortDirectionView } from "../../components/SortDirectionView"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { log, Utils } from "../../config/Utils"
import { expansionInfoMapNumbers } from "../../expansions/Expansions"
import { ExpansionSelectOrExclude, SelectedOrExcludedExpansions } from "../../expansions/ExpansionSelectOrExclude"
import { PatreonRewardsTier } from "../../generated-src/PatreonRewardsTier"
import { AuctionDeckIcon } from "../../generic/icons/AuctionDeckIcon"
import { SellDeckIcon } from "../../generic/icons/SellDeckIcon"
import { TradeDeckIcon } from "../../generic/icons/TradeDeckIcon"
import { HouseSelectOrExclude, SelectedOrExcludedHouses } from "../../houses/HouseSelectOrExclude"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { KeyLink } from "../../mui-restyled/KeyLink"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { NotesAndTagsSearch } from "../../notes/NotesAndTagsSearch"
import { messageStore } from "../../ui/MessageStore"
import { screenStore } from "../../ui/ScreenStore"
import { userStore } from "../../user/UserStore"
import { deckStore } from "../DeckStore"
import { CreateForSaleQuery } from "../salenotifications/CreateForSaleQuery"
import { DeckSorts, DeckSortSelect, DeckSortSelectStore } from "../selects/DeckSortSelect"
import { ConstraintDropdowns, FiltersConstraintsStore } from "./ConstraintDropdowns"
import { DeckCardSelect } from "./DeckCardSelect"
import { DeckFilters } from "./DeckFilters"
import { deckSearchFiltersStore } from "./DeckSearchFiltersStore"
import { DownloadDeckResults } from "./DownloadDeckResults"

interface DecksSearchDrawerProps {
    location: History.Location
    history: History.History
    filters: DeckFilters
}

@observer
export class DecksSearchDrawer extends React.Component<DecksSearchDrawerProps> {

    @observable
    displayHouses = false
    @observable
    displayConstraints = false
    @observable
    displayCards = false

    selectedExpansions = new SelectedOrExcludedExpansions(this.props.filters.expansions.map(expNum => expansionInfoMapNumbers.get(expNum)!.backendEnum))
    selectedHouses = new SelectedOrExcludedHouses(this.props.filters.houses, this.props.filters.excludeHouses)
    selectedSortStore = new DeckSortSelectStore(
        this.props.filters.forTrade || (this.props.filters.forSale === true),
        this.props.filters.forAuction && !(this.props.filters.forTrade || this.props.filters.forSale),
        this.props.filters.completedAuctions,
        this.props.filters.sort
    )
    constraintsStore = new FiltersConstraintsStore(this.props.filters.constraints)

    search = (event?: React.FormEvent, analyze?: boolean) => {
        if (event) {
            event.preventDefault()
        }
        const filters = this.props.filters
        filters.expansions = this.selectedExpansions.expansionsAsNumberArray()
        filters.houses = this.selectedHouses.getHousesSelectedTrue()
        filters.excludeHouses = this.selectedHouses.getHousesExcludedTrue()

        if (!this.selectedHouses.validHouseSelection()) {
            messageStore.setWarningMessage("You may select up to 3 houses with houses excluded, and exclude all but 3.")
            return
        }

        filters.sort = this.selectedSortStore.toEnumValue()
        filters.constraints = this.constraintsStore.cleanConstraints()

        if (!filters.forSale && !filters.forTrade && !filters.forAuction && !filters.myFavorites && !filters.owner) {
            // search is broad, so disable bad searches
            if (filters.sort === "NAME") {
                messageStore.setWarningMessage("To use the name sort please check for sale, for trade, my decks, or my favorites.")
                return
            }
        }

        if (analyze) {
            this.props.history.push(Routes.analyzeDeckSearch(filters))
        } else {
            this.props.history.push(Routes.deckSearch(filters))
        }
        keyDrawerStore.closeIfSmall()
    }

    clearSearch = () => {
        this.selectedHouses.reset()
        this.selectedSortStore.selectedValue = ""
        this.props.filters.reset()
        this.constraintsStore.reset()
        this.selectedExpansions.reset()
        deckSearchFiltersStore.reset()
    }

    updateForSale = (forSale?: boolean) => {
        const filters = this.props.filters
        filters.forSale = forSale
        if (forSale === false) {
            filters.forTrade = false
            filters.forAuction = false
        }
        this.handleOtherValuesForSaleOrTrade()
    }

    updateForAuction = (forAuction: boolean) => {
        const filters = this.props.filters
        filters.forAuction = forAuction
        if (forAuction && filters.forSale === false) {
            filters.forSale = undefined
        }
        this.handleOtherValuesForSaleOrTrade()
    }

    updateForTrade = (forTrade: boolean) => {
        const filters = this.props.filters
        filters.forTrade = forTrade
        if (forTrade && filters.forSale === false) {
            filters.forSale = undefined
        }
        this.handleOtherValuesForSaleOrTrade()
    }

    private handleOtherValuesForSaleOrTrade = () => {
        const filters = this.props.filters
        if (!(filters.forSale || filters.forTrade || filters.forAuction)) {
            filters.forSaleInCountry = undefined
        }
        this.selectedSortStore.forSaleOrTrade = filters.forSale || filters.forTrade
        this.selectedSortStore.forAuction = filters.forAuction
        this.selectedSortStore.completedAuctions = false
        filters.completedAuctions = false
        filters.notForSale = false

        if (!this.selectedSortStore.sortIsValid()) {
            log.debug("Sort not defined")
            filters.sort = DeckSorts.sas
        }
    }

    @computed
    get myDecks(): boolean {
        return this.props.filters.owner === userStore.username
    }

    render() {
        const {
            title, myFavorites, handleTitleUpdate, handleMyDecksUpdate, handleMyFavoritesUpdate, cards, owner, forSale, forTrade, forAuction,
            forSaleInCountry, handleNotesUpdate, notes, notesUser, removeNotes, completedAuctions, teamDecks, withOwners
        } = this.props.filters

        const analyze = this.props.location.pathname.includes(Routes.collectionStats)

        let myCountry: string | undefined
        if (!!(userStore.country
            && (forSale || forTrade || forAuction))) {
            myCountry = userStore.country
        }
        const showLoginForCountry = !myCountry && (forSale || forTrade || forAuction)
        const showMyDecks = userStore.loggedIn()
        const showDecksOwner = !!owner && owner !== userStore.username

        const constraintOptions = [
            "amberControl",
            "expectedAmber",
            "artifactControl",
            "creatureControl",
            "efficiency",
            "disruption",
            "effectivePower",
            "rawAmber",
            "bonusCapture",
            "bonusDraw",
            "aercScore",
            "synergyRating",
            "antisynergyRating",
            "sasRating",
            "creatureCount",
            "actionCount",
            "artifactCount",
            "upgradeCount",
            // "bonusDraw",
            // "bonusCapture",
            "powerLevel",
            "chains",
            "maverickCount",
        ]
        const hideMinMaxConstraintOptions = [
            "listedWithinDays"
        ]

        if (forSale) {
            constraintOptions.unshift("buyItNow")
        }
        if (forSale || forTrade) {
            constraintOptions.unshift("listedWithinDays")
        }

        const count = deckStore.decksCount?.count
        const analyzedCount = deckStore.collectionStats?.deckCount

        return (
            <KeyDrawer version={analyze ? KeyDrawerVersion.ANALYSIS : KeyDrawerVersion.DECK}>
                <form onSubmit={this.search}>
                    <List dense={true}>
                        <ListItem>
                            <TextField
                                label={"Deck Name"}
                                onChange={handleTitleUpdate}
                                value={title}
                                fullWidth={!screenStore.screenSizeXs()}
                            />
                            <div style={{flexGrow: 1}}/>
                            {screenStore.screenSizeXs() ? (
                                <IconButton onClick={() => keyDrawerStore.open = false}>
                                    <Close/>
                                </IconButton>
                            ) : null}
                        </ListItem>
                        <ListItem style={{marginTop: spacing(2)}}>
                            <ExpansionSelectOrExclude selectedExpansions={this.selectedExpansions}/>
                        </ListItem>
                        <ListItem style={{marginTop: spacing(1)}}>
                            <div>
                                <Typography variant={"subtitle1"} color={"textSecondary"}>Options</Typography>
                                <FormGroup row={true}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.myDecks}
                                                onChange={handleMyDecksUpdate}
                                                disabled={!showMyDecks}
                                            />
                                        }
                                        label={<Typography variant={"body2"}>My Decks</Typography>}
                                        style={{width: 136}}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.props.filters.forSale === true}
                                                onChange={(event) => this.updateForSale(event.target.checked ? true : undefined)}
                                            />
                                        }
                                        label={(
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <SellDeckIcon/>
                                                <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>For Sale</Typography>
                                            </div>
                                        )}
                                        style={{width: 136}}
                                    />
                                    <div style={{display: "flex"}}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={myCountry != null && forSaleInCountry === myCountry}
                                                    onChange={(event) => this.props.filters.forSaleInCountry = event.target.checked ? myCountry : undefined}
                                                    disabled={!myCountry}
                                                />
                                            }
                                            label={<Typography variant={"body2"}>In My Country</Typography>}
                                            style={{width: 136}}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.props.filters.forSale === false}
                                                    onChange={(event) => this.updateForSale(event.target.checked ? false : undefined)}
                                                />
                                            }
                                            label={<Typography variant={"body2"}>Not For Sale</Typography>}
                                            style={{width: 136}}
                                        />
                                    </div>
                                    {showDecksOwner && (
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <Typography variant={"body2"}>
                                                Owner: <Link href={Routes.userProfilePage(owner)} target={"_blank"}>{owner}</Link>
                                            </Typography>
                                            <IconButton onClick={() => this.props.filters.owner = ""}><Delete fontSize={"small"}/></IconButton>
                                        </div>
                                    )}
                                    {showLoginForCountry ? (
                                        <div style={{display: "flex"}}>
                                            <KeyLink to={userStore.loggedIn() ? Routes.myProfile : Routes.registration}>
                                                <Typography variant={"body2"}>
                                                    Select your country
                                                </Typography>
                                            </KeyLink>
                                            <Typography variant={"body2"} style={{marginLeft: spacing(1)}}>
                                                to filter decks by country
                                            </Typography>
                                        </div>
                                    ) : null}
                                    {this.props.filters.notForSale ? (
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <Typography>Not for sale</Typography>
                                            <IconButton onClick={() => this.props.filters.notForSale = false}><Delete fontSize={"small"}/></IconButton>
                                        </div>
                                    ) : null}
                                </FormGroup>
                            </div>
                        </ListItem>
                        <ListItem style={{marginTop: spacing(1)}}>
                            <div>
                                <SearchDrawerExpansionPanel
                                    initiallyOpen={
                                        forAuction || forTrade || myFavorites || completedAuctions || teamDecks
                                        || withOwners
                                    }
                                    title={"Extra Options"}
                                >
                                    <div style={{display: "flex", flexWrap: "wrap", flexGrow: 1}}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.props.filters.forAuction}
                                                    onChange={(event) => this.updateForAuction(event.target.checked)}
                                                />
                                            }
                                            label={(
                                                <div style={{display: "flex", alignItems: "center"}}>
                                                    <AuctionDeckIcon style={{minWidth: 18}}/>
                                                    <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>Auctions</Typography>
                                                </div>
                                            )}
                                            style={{width: 136}}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.props.filters.forTrade}
                                                    onChange={(event) => this.updateForTrade(event.target.checked)}
                                                />
                                            }
                                            label={(
                                                <div style={{display: "flex", alignItems: "center"}}>
                                                    <TradeDeckIcon style={{minWidth: 18}}/>
                                                    <Typography style={{marginLeft: spacing(1)}} variant={"body2"}>For Trade</Typography>
                                                </div>
                                            )}
                                            style={{width: 136}}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={myFavorites}
                                                    onChange={handleMyFavoritesUpdate}
                                                    disabled={!showMyDecks}
                                                />
                                            }
                                            label={<Typography variant={"body2"}>My Favorites</Typography>}
                                            style={{width: 136}}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.props.filters.completedAuctions}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        this.props.filters.handleCompletedAuctionsUpdate(event)
                                                        this.selectedSortStore.completedAuctions = this.props.filters.completedAuctions
                                                    }}
                                                />
                                            }
                                            label={<Typography variant={"body2"}>Past Auctions</Typography>}
                                            style={{width: 136}}
                                        />
                                        {userStore.patron && userStore.hasTeam && (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={this.props.filters.teamDecks}
                                                        onChange={(event) => {
                                                            this.props.filters.teamDecks = event.target.checked
                                                        }}
                                                    />
                                                }
                                                label={<Typography variant={"body2"}>Team Decks</Typography>}
                                                style={{width: 136}}
                                            />
                                        )}
                                        {userStore.username != null && ["Coraythan", "randomjoe", "dzky", "Zarathustra05"].includes(userStore.username) && (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={this.props.filters.withOwners}
                                                        onChange={(event) => this.props.filters.withOwners = event.target.checked}
                                                    />
                                                }
                                                label={<Typography variant={"body2"}>With Owners</Typography>}
                                                style={{width: 136}}
                                            />
                                        )}
                                    </div>
                                </SearchDrawerExpansionPanel>
                                <SearchDrawerExpansionPanel
                                    initiallyOpen={notesUser.length > 0 || notes.length > 0 || !!keyLocalStorage.genericStorage.viewNotes}
                                    title={"Notes"}
                                >
                                    <NotesAndTagsSearch
                                        notesUser={notesUser}
                                        notes={notes}
                                        handleNotesUpdate={handleNotesUpdate}
                                        removeNotes={removeNotes}
                                        notesNotLike={this.props.filters.notNotes}
                                        handleNotesNotLikeUpdate={() => this.props.filters.notNotes = !this.props.filters.notNotes}

                                    />
                                </SearchDrawerExpansionPanel>
                                <SearchDrawerExpansionPanel initiallyOpen={this.selectedHouses.anySelected()} title={"Houses"}>
                                    <HouseSelectOrExclude selectedHouses={this.selectedHouses} excludeTitle={true}/>
                                </SearchDrawerExpansionPanel>
                                <SearchDrawerExpansionPanel
                                    initiallyOpen={this.constraintsStore.constraints.length > 0}
                                    title={"Constraints"}
                                    onClick={() => {
                                        if (this.constraintsStore.constraints.length === 0) {
                                            this.constraintsStore.addDefault()
                                        }
                                    }}
                                >
                                    <ConstraintDropdowns
                                        store={this.constraintsStore}
                                        properties={constraintOptions}
                                        hideMinMax={hideMinMaxConstraintOptions}
                                    />
                                    {userStore.contentCreator && (
                                        <TextField
                                            label={"Min Adaptive Score"}
                                            value={deckSearchFiltersStore.adaptiveScoreFilter?.toString() ?? ""}
                                            type={"number"}
                                            onChange={event => deckSearchFiltersStore.adaptiveScoreFilter = Utils.toNumberOrUndefined(event.target.value)}
                                        />
                                    )}
                                </SearchDrawerExpansionPanel>
                                <SearchDrawerExpansionPanel
                                    initiallyOpen={cards.length > 0}
                                    title={"Cards"}
                                    onClick={() => {
                                        if (cards.length === 0) {
                                            cards.push({cardNames: [], quantity: 1, mav: false})
                                        }
                                    }}
                                >
                                    <DeckCardSelect cards={cards}/>
                                </SearchDrawerExpansionPanel>
                                <Divider style={{marginBottom: spacing(1)}}/>
                            </div>
                        </ListItem>
                        <ListItem>
                            <DeckSortSelect store={this.selectedSortStore}/>
                            <div style={{marginTop: "auto", marginLeft: spacing(2)}}>
                                <SortDirectionView hasSort={this.props.filters}/>
                            </div>
                            {!screenStore.smallDeckView() && !analyze && (
                                <DownloadDeckResults filters={this.props.filters}/>
                            )}
                        </ListItem>
                        <ListItem>
                            <div style={{display: "flex", marginTop: spacing(1), marginBottom: spacing(1)}}>
                                <KeyButton
                                    variant={"outlined"}
                                    onClick={this.clearSearch}
                                    style={{marginRight: spacing(2)}}
                                >
                                    Clear
                                </KeyButton>
                                <CreateForSaleQuery
                                    filters={this.props.filters}
                                    houses={this.selectedHouses}
                                    constraints={this.constraintsStore}
                                />
                                {analyze ? (
                                    <KeyButton
                                        onClick={() => this.search(undefined, true)}
                                        variant={"contained"}
                                        color={"primary"}
                                        loading={deckStore.calculatingStats}
                                        disabled={deckStore.searchingForDecks || deckStore.calculatingStats}
                                        style={{marginRight: spacing(2)}}
                                    >
                                        Analyze
                                    </KeyButton>
                                ) : (
                                    <KeyButton
                                        variant={"contained"}
                                        color={"secondary"}
                                        type={"submit"}
                                        loading={deckStore.searchingForDecks}
                                        disabled={deckStore.searchingForDecks || deckStore.calculatingStats}
                                    >
                                        Search
                                    </KeyButton>
                                )}
                            </div>
                        </ListItem>
                        {count != null && !analyze && (
                            <ListItem>
                                <Typography variant={"subtitle2"} style={{marginBottom: spacing(1)}}>
                                    {`You found ${count}${count === 1000 || count === 10000 ? "+ " : ""} decks`}
                                </Typography>
                            </ListItem>
                        )}
                        {analyzedCount && analyze && (
                            <ListItem>
                                <Typography variant={"subtitle2"} style={{marginBottom: spacing(1)}}>
                                    {analyzedCount == keyLocalStorage.findAnalyzeCount()
                                        ? `You analyzed the first ${analyzedCount} decks found` : `You analyzed ${analyzedCount} decks`}
                                </Typography>
                            </ListItem>
                        )}
                        {deckStore.countingDecks ? (
                            <ListItem>
                                <Typography variant={"subtitle2"}>Counting ...</Typography>
                            </ListItem>
                        ) : null}
                            <ListItem>
                                <Box display={"flex"} alignItems={"center"}>
                                    {userStore.loggedIn() && (
                                        <Tooltip title={userStore.patron ? "" : "Become a patron to analyze decks!"}>
                                            <div>
                                                <LinkButton
                                                    size={"small"}
                                                    variant={"outlined"}
                                                    href={analyze ? Routes.deckSearch(this.props.filters) : Routes.analyzeDeckSearch(this.props.filters)}
                                                    disabled={!userStore.patron}
                                                    style={{marginRight: spacing(2)}}
                                                >
                                                    {analyze ? "Search" : "Analyze"}
                                                </LinkButton>
                                            </div>
                                        </Tooltip>
                                    )}
                                    {analyze ? (
                                        <Tooltip title={"Max decks to analyze"}>
                                            <ToggleButtonGroup
                                                value={keyLocalStorage.findAnalyzeCount()}
                                                exclusive={true}
                                                onChange={(event, size) => {
                                                    keyLocalStorage.updateGenericStorage({analyzeCount: size})
                                                    this.search(undefined, true)
                                                }}
                                                size={"small"}
                                            >
                                                <ToggleButton value={100}>
                                                    100
                                                </ToggleButton>
                                                <ToggleButton value={500}>
                                                    500
                                                </ToggleButton>
                                                {userStore.patronLevelEqualToOrHigher(PatreonRewardsTier.SUPPORT_SOPHISTICATION) && (
                                                    <ToggleButton value={1000}>
                                                        1000
                                                    </ToggleButton>
                                                )}
                                                {userStore.patronLevelEqualToOrHigher(PatreonRewardsTier.MERCHANT_AEMBERMAKER) && (
                                                    <ToggleButton value={2500}>
                                                        2500
                                                    </ToggleButton>
                                                )}
                                            </ToggleButtonGroup>
                                        </Tooltip>
                                    ) : (
                                        <>
                                            <Tooltip title={"View type"}>
                                                <ToggleButtonGroup
                                                    value={keyLocalStorage.deckListViewType}
                                                    exclusive={true}
                                                    onChange={(event, viewType) => {
                                                        keyLocalStorage.setDeckListViewType(viewType)
                                                    }}
                                                    style={{marginRight: spacing(2)}}
                                                    size={"small"}
                                                >
                                                    <ToggleButton value={"grid"}>
                                                        <ViewModule/>
                                                    </ToggleButton>
                                                    <ToggleButton value={"graphs"}>
                                                        <BarChart/>
                                                    </ToggleButton>
                                                    <ToggleButton value={"table"}>
                                                        <ViewList/>
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                            </Tooltip>
                                            <Tooltip title={"Page size"}>
                                                <ToggleButtonGroup
                                                    value={keyLocalStorage.deckPageSize}
                                                    exclusive={true}
                                                    onChange={(event, size) => {
                                                        keyLocalStorage.setDeckPageSize(size)
                                                        this.search()
                                                    }}
                                                    size={"small"}
                                                >
                                                    <ToggleButton value={20}>
                                                        20
                                                    </ToggleButton>
                                                    <ToggleButton value={100}>
                                                        100
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                            </Tooltip>
                                        </>
                                    )}
                                </Box>
                            </ListItem>
                    </List>
                </form>
            </KeyDrawer>
        )
    }
}
