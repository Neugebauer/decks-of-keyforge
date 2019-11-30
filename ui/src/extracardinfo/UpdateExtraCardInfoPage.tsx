import { Card, Checkbox, Grid, IconButton, MenuItem, TextField, Tooltip, Typography } from "@material-ui/core"
import { ChevronLeft, ChevronRight, Delete, Save } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { RouteComponentProps } from "react-router-dom"
import { SingleCardSearchSuggest } from "../cards/CardSearchSuggest"
import { CardView } from "../cards/CardSimpleView"
import { cardStore } from "../cards/CardStore"
import { KCard } from "../cards/KCard"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log, prettyJson, Utils } from "../config/Utils"
import { BackendExpansion } from "../expansions/Expansions"
import { EventValue } from "../generic/EventValue"
import { UnstyledLink } from "../generic/UnstyledLink"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { SynTraitType } from "../synergy/SynTraitType"
import { SynTraitRatingValues, SynTraitValue } from "../synergy/SynTraitValue"
import { TraitBubble } from "../synergy/TraitBubble"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { ExtraCardInfo } from "./ExtraCardInfo"
import { extraCardInfoStore } from "./ExtraCardInfoStore"
import { noSynTraits, specialTraits, SynergyTrait } from "./SynergyTrait"

interface UpdateExtraCardInfoPageProps extends RouteComponentProps<{ infoId: string }> {
}

@observer
export class UpdateExtraCardInfoPage extends React.Component<UpdateExtraCardInfoPageProps> {

    componentDidMount(): void {
        if (this.props.match.params.infoId) {
            extraCardInfoStore.findExtraCardInfo(this.props.match.params.infoId)
        }
    }

    componentDidUpdate(prevProps: UpdateExtraCardInfoPageProps): void {
        if (prevProps.match.params.infoId && this.props.match.params.infoId != this.props.match.params.infoId) {
            extraCardInfoStore.findExtraCardInfo(this.props.match.params.infoId)
        }
    }

    render() {
        const extraCardInfo = extraCardInfoStore.extraCardInfo
        const allCards = cardStore.allCards
        if (extraCardInfo == null || allCards.length === 0) {
            return <Loader/>
        }
        const card = cardStore.findCardByIdentifier(extraCardInfo.cardNumbers[0])
        if (card == null) {
            return <Loader/>
        }
        return <UpdateExtraCardInfo extraCardInfo={extraCardInfo} card={card}/>
    }
}

interface UpdateExtraCardInfoProps {
    extraCardInfo: ExtraCardInfo
    card: KCard
}

@observer
class UpdateExtraCardInfo extends React.Component<UpdateExtraCardInfoProps> {

    @observable
    amberControl = "0"
    @observable
    expectedAmber = "0"
    @observable
    artifactControl = "0"
    @observable
    creatureControl = "0"
    @observable
    aercScore = "0"
    @observable
    efficiency = "0"
    @observable
    effectivePower = "0"
    @observable
    amberProtection = "0"
    @observable
    disruption = "0"
    @observable
    houseCheating = "0"
    @observable
    other = "0"

    @observable
    amberControlMax = "0"
    @observable
    expectedAmberMax = "0"
    @observable
    artifactControlMax = "0"
    @observable
    creatureControlMax = "0"
    @observable
    aercScoreMax = "0"
    @observable
    efficiencyMax = "0"
    @observable
    effectivePowerMax = "0"
    @observable
    amberProtectionMax = "0"
    @observable
    disruptionMax = "0"
    @observable
    houseCheatingMax = "0"
    @observable
    otherMax = "0"

    @observable
    traits: SynTraitValue[] = []
    @observable
    synergies: SynTraitValue[] = []

    // eslint-disable-next-line
    // @ts-ignore
    infoId: string
    // eslint-disable-next-line
    // @ts-ignore
    card: KCard

    constructor(props: UpdateExtraCardInfoProps) {
        super(props)
        this.reset(props.extraCardInfo)
    }

    componentDidUpdate(prevProps: Readonly<UpdateExtraCardInfoProps>) {
        if (prevProps.extraCardInfo !== this.props.extraCardInfo) {
            this.reset(this.props.extraCardInfo)
        }
    }

    reset = (resetTo: ExtraCardInfo) => {
        const extraCardInfo = resetTo == null ? this.props.extraCardInfo : resetTo
        this.infoId = extraCardInfo.id
        this.card = this.props.card

        this.amberControl = extraCardInfo.amberControl.toString()
        this.expectedAmber = extraCardInfo.expectedAmber.toString()
        this.artifactControl = extraCardInfo.artifactControl.toString()
        this.creatureControl = extraCardInfo.creatureControl.toString()
        this.efficiency = extraCardInfo.efficiency.toString()
        this.effectivePower = extraCardInfo.effectivePower.toString()
        this.amberProtection = extraCardInfo.amberProtection.toString()
        this.disruption = extraCardInfo.disruption.toString()
        this.houseCheating = extraCardInfo.houseCheating.toString()
        this.other = extraCardInfo.other.toString()

        this.amberControlMax = extraCardInfo.amberControlMax == null ? "0" : extraCardInfo.amberControlMax.toString()
        this.expectedAmberMax = extraCardInfo.expectedAmberMax == null ? "0" : extraCardInfo.expectedAmberMax.toString()
        this.artifactControlMax = extraCardInfo.artifactControlMax == null ? "0" : extraCardInfo.artifactControlMax.toString()
        this.creatureControlMax = extraCardInfo.creatureControlMax == null ? "0" : extraCardInfo.creatureControlMax.toString()
        this.efficiencyMax = extraCardInfo.efficiencyMax == null ? "0" : extraCardInfo.efficiencyMax.toString()
        this.effectivePowerMax = extraCardInfo.effectivePowerMax == null ? "0" : extraCardInfo.effectivePowerMax.toString()
        this.amberProtectionMax = extraCardInfo.amberProtectionMax == null ? "0" : extraCardInfo.amberProtectionMax.toString()
        this.disruptionMax = extraCardInfo.disruptionMax == null ? "0" : extraCardInfo.disruptionMax.toString()
        this.houseCheatingMax = extraCardInfo.houseCheatingMax == null ? "0" : extraCardInfo.houseCheatingMax.toString()
        this.otherMax = extraCardInfo.otherMax == null ? "0" : extraCardInfo.otherMax.toString()

        log.debug("traits length " + extraCardInfo.traits.length)
        this.traits = extraCardInfo.traits
        this.synergies = extraCardInfo.synergies

        uiStore.setTopbarValues("Edit " + this.card.cardTitle, "Edit", "")
    }

    save = async () => {

        const extraCardInfo: ExtraCardInfo = {
            ...this.props.extraCardInfo,

            amberControl: Number(this.amberControl),
            expectedAmber: Number(this.expectedAmber),
            artifactControl: Number(this.artifactControl),
            creatureControl: Number(this.creatureControl),
            efficiency: Number(this.efficiency),
            effectivePower: Number(this.effectivePower),
            amberProtection: Number(this.amberProtection),
            disruption: Number(this.disruption),
            houseCheating: Number(this.houseCheating),
            other: Number(this.other),

            amberControlMax: Number(this.amberControlMax),
            expectedAmberMax: Number(this.expectedAmberMax),
            artifactControlMax: Number(this.artifactControlMax),
            creatureControlMax: Number(this.creatureControlMax),
            efficiencyMax: Number(this.efficiencyMax),
            effectivePowerMax: Number(this.effectivePowerMax),
            amberProtectionMax: Number(this.amberProtectionMax),
            disruptionMax: Number(this.disruptionMax),
            houseCheatingMax: Number(this.houseCheatingMax),
            otherMax: Number(this.otherMax),

            traits: this.traits,
            synergies: this.synergies
        }
        log.debug(`Traits we're saving: ${prettyJson(extraCardInfo.traits)}`)
        await extraCardInfoStore.saveExtraCardInfo(extraCardInfo)
        const saved = await extraCardInfoStore.findExtraCardInfo(this.infoId)
        this.reset(saved)
    }

    render() {
        const wcOnly = keyLocalStorage.genericStorage.wcOnly
        const filteredCards = cardStore.allCards
            .filter(card => wcOnly ? card.extraCardInfo.cardNumbers.length === 1 && card.extraCardInfo.cardNumbers.find(cardNum => cardNum.expansion === BackendExpansion.WORLDS_COLLIDE || cardNum.expansion === BackendExpansion.ANOMALY_EXPANSION) : true)
        let nextId
        let prevId
        if (filteredCards.length > 0 && this.props.extraCardInfo != null) {
            const findWith = filteredCards.find(card => card.id === this.card.id)
            if (findWith != null) {
                const idx = filteredCards.indexOf(findWith)
                nextId = idx > -1 && idx < filteredCards.length - 1 ? filteredCards[idx + 1].extraCardInfo.id : undefined
                prevId = idx > 0 ? filteredCards[idx - 1].extraCardInfo.id : undefined
            }
        }
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: screenStore.screenWidth > 1200 ? undefined : "column"
                }}
            >
                {this.card && (
                    <div>
                        <Typography variant={"h5"} style={{marginLeft: spacing(2), marginBottom: spacing(2)}}>Current Values</Typography>
                        <CardView card={this.card}/>
                    </div>
                )}
                <div>
                    <Card style={{maxWidth: 800, margin: spacing(4), padding: spacing(2)}}>
                        <div style={{display: "flex", alignItems: "center", marginBottom: spacing(2)}}>
                            <Typography variant={"h4"}>
                                {this.card.cardTitle}'s AERC
                            </Typography>
                            <div style={{flexGrow: 1}}/>
                            <Tooltip title={"Worlds Collide Only"}>
                                <Checkbox
                                    style={{marginLeft: spacing(2)}}
                                    checked={wcOnly}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => keyLocalStorage.updateGenericStorage({wcOnly: event.target.checked})}
                                />
                            </Tooltip>
                            {prevId != null && (
                                <UnstyledLink to={Routes.editExtraCardInfo(prevId)} style={{marginLeft: spacing(2)}}>
                                    <IconButton>
                                        <ChevronLeft/>
                                    </IconButton>
                                </UnstyledLink>
                            )}
                            {nextId != null && (
                                <UnstyledLink to={Routes.editExtraCardInfo(nextId)} style={{marginLeft: spacing(2)}}>
                                    <IconButton>
                                        <ChevronRight/>
                                    </IconButton>
                                </UnstyledLink>
                            )}
                        </div>
                        <Grid
                            container={true}
                            spacing={2}
                            style={{marginTop: spacing(2)}}
                        >
                            <InfoInput
                                name={"expected aember"}
                                value={this.expectedAmber}
                                update={(event: EventValue) => this.expectedAmber = event.target.value}
                            />
                            <InfoInput
                                name={"exp aember max"}
                                value={this.expectedAmberMax}
                                update={(event: EventValue) => this.expectedAmberMax = event.target.value}
                            />
                            <InfoInput
                                name={"aember control"}
                                value={this.amberControl}
                                update={(event: EventValue) => this.amberControl = event.target.value}
                            />
                            <InfoInput
                                name={"aember control max"}
                                value={this.amberControlMax}
                                update={(event: EventValue) => this.amberControlMax = event.target.value}
                            />
                            <InfoInput
                                name={"artifact control"}
                                value={this.artifactControl}
                                update={(event: EventValue) => this.artifactControl = event.target.value}
                            />
                            <InfoInput
                                name={"artifact control max"}
                                value={this.artifactControlMax}
                                update={(event: EventValue) => this.artifactControlMax = event.target.value}
                            />
                            <InfoInput
                                name={"creature control"}
                                value={this.creatureControl}
                                update={(event: EventValue) => this.creatureControl = event.target.value}
                            />
                            <InfoInput
                                name={"creature control max"}
                                value={this.creatureControlMax}
                                update={(event: EventValue) => this.creatureControlMax = event.target.value}
                            />
                            <InfoInput
                                name={"efficiency"}
                                value={this.efficiency}
                                update={(event: EventValue) => this.efficiency = event.target.value}
                            />
                            <InfoInput
                                name={"efficiency max"}
                                value={this.efficiencyMax}
                                update={(event: EventValue) => this.efficiencyMax = event.target.value}
                            />
                            <InfoInput
                                name={"disruption"}
                                value={this.disruption}
                                update={(event: EventValue) => this.disruption = event.target.value}
                            />
                            <InfoInput
                                name={"disruption max"}
                                value={this.disruptionMax}
                                update={(event: EventValue) => this.disruptionMax = event.target.value}
                            />
                            <InfoInput
                                name={"effective power"}
                                value={this.effectivePower}
                                update={(event: EventValue) => this.effectivePower = event.target.value}
                            />
                            <InfoInput
                                name={"effective power max"}
                                value={this.effectivePowerMax}
                                update={(event: EventValue) => this.effectivePowerMax = event.target.value}
                            />
                            <InfoInput
                                name={"aember protection"}
                                value={this.amberProtection}
                                update={(event: EventValue) => this.amberProtection = event.target.value}
                            />
                            <InfoInput
                                name={"aember prot max"}
                                value={this.amberProtectionMax}
                                update={(event: EventValue) => this.amberProtectionMax = event.target.value}
                            />
                            <InfoInput
                                name={"house cheating"}
                                value={this.houseCheating}
                                update={(event: EventValue) => this.houseCheating = event.target.value}
                            />
                            <InfoInput
                                name={"house cheating max"}
                                value={this.houseCheatingMax}
                                update={(event: EventValue) => this.houseCheatingMax = event.target.value}
                            />
                            <InfoInput
                                name={"other"}
                                value={this.other}
                                update={(event: EventValue) => this.other = event.target.value}
                            />
                            <InfoInput
                                name={"other max"}
                                value={this.otherMax}
                                update={(event: EventValue) => this.otherMax = event.target.value}
                            />
                            <Grid item={true} xs={12} sm={6}>
                                <div>
                                    {this.traits.map((synergy, idx) => (
                                        <div
                                            key={idx}
                                            style={{display: "flex"}}
                                        >
                                            <TraitBubble
                                                name={synergy.trait}
                                                positive={synergy.rating > 0}
                                                synTraitType={synergy.type}
                                                rating={synergy.rating}
                                                trait={true}
                                            />
                                            <IconButton
                                                onClick={() => this.traits.splice(idx, 1)}
                                            >
                                                <Delete/>
                                            </IconButton>
                                        </div>
                                    ))}
                                    <AddTrait name={"trait"} addTo={this.traits} trait={true}/>
                                </div>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <div>
                                    {this.synergies.map((synergy, idx) => (
                                        <div
                                            key={idx}
                                            style={{display: "flex"}}
                                        >
                                            <TraitBubble
                                                name={synergy.trait}
                                                positive={synergy.rating > 0}
                                                synTraitType={synergy.type}
                                                rating={synergy.rating}
                                                cardName={synergy.cardName}
                                            />
                                            <IconButton
                                                onClick={() => this.synergies.splice(idx, 1)}
                                            >
                                                <Delete/>
                                            </IconButton>
                                        </div>
                                    ))}
                                    <AddTrait name={"synergy"} addTo={this.synergies} trait={false}/>
                                </div>
                            </Grid>
                        </Grid>
                        <div style={{marginTop: spacing(2), display: "flex"}}>
                            <LinkButton
                                to={Routes.cards}
                                style={{marginRight: spacing(2)}}
                            >
                                Cards
                            </LinkButton>
                            <div style={{flexGrow: 1}}/>
                            <KeyButton
                                variant={"contained"}
                                color={"primary"}
                                loading={extraCardInfoStore.savingExtraCardInfo}
                                onClick={this.save}
                            >
                                Save
                            </KeyButton>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }
}

const InfoInput = (props: { name: string, value: string, update: (event: EventValue) => void }) => {
    const {name, value, update} = props
    return (
        <Grid item={true} xs={6} sm={3}>
            <TextField
                label={name}
                value={value}
                onChange={update}
                fullWidth={true}
                variant={"outlined"}
                type={"number"}
            />
        </Grid>
    )
}

@observer
class AddTrait extends React.Component<{ name: string, addTo: SynTraitValue[], trait?: boolean }> {

    @observable
    trait: SynergyTrait = SynergyTrait.dealsDamage

    @observable
    rating: SynTraitRatingValues = 3

    @observable
    type: SynTraitType = SynTraitType.anyHouse

    @observable
    holdsCard = {
        cardName: ""
    }

    render() {
        const {trait} = this.props
        const selectableTraits = Utils.enumValues(SynergyTrait)
            .filter(traitValue => !(trait ? specialTraits : noSynTraits).includes(traitValue as SynergyTrait))
        return (
            <div style={{display: "flex", alignItems: "center", flexWrap: "wrap", marginTop: spacing(1)}}>
                <TextField
                    select={true}
                    label={this.props.name}
                    value={this.trait}
                    onChange={(event) => this.trait = event.target.value as SynergyTrait}
                    style={{marginRight: spacing(2)}}
                >
                    {selectableTraits.map(option => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                {!trait && (
                    <div style={{width: 120, marginRight: spacing(2)}}>
                        <SingleCardSearchSuggest card={this.holdsCard} placeholder={"Card"}/>
                    </div>
                )}
                <TextField
                    select={true}
                    label="rating"
                    value={this.rating}
                    onChange={(event) => this.rating = Number(event.target.value) as SynTraitRatingValues}
                    style={{marginRight: spacing(2)}}
                >
                    <MenuItem value={-4}>
                        -4
                    </MenuItem>
                    <MenuItem value={-3}>
                        -3
                    </MenuItem>
                    <MenuItem value={-2}>
                        -2
                    </MenuItem>
                    <MenuItem value={-1}>
                        -1
                    </MenuItem>
                    <MenuItem value={1}>
                        1
                    </MenuItem>
                    <MenuItem value={2}>
                        2
                    </MenuItem>
                    <MenuItem value={3}>
                        3
                    </MenuItem>
                    <MenuItem value={4}>
                        4
                    </MenuItem>
                </TextField>
                <TextField
                    select={true}
                    label="type"
                    value={this.type}
                    onChange={(event) => this.type = event.target.value as SynTraitType}
                    style={{marginRight: spacing(2)}}
                >
                    {Utils.enumValues(SynTraitType).map(option => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <IconButton
                    onClick={() => this.props.addTo.push({
                        trait: this.holdsCard.cardName.length > 0 ? SynergyTrait.card : this.trait,
                        rating: this.rating,
                        cardName: this.holdsCard.cardName.length > 0 ? this.holdsCard.cardName : undefined,
                        type: this.type
                    })}
                >
                    <Save/>
                </IconButton>
            </div>
        )
    }
}