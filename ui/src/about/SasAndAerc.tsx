import { Divider, List, ListItem, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { DeckScorePill } from "../decks/DeckScoreView"
import { AboveAverageIcon } from "../generic/icons/AboveAverageIcon"
import { AverageIcon } from "../generic/icons/AverageIcon"
import { BelowAverageIcon } from "../generic/icons/BelowAverageIcon"
import { CardQualityIcon } from "../generic/icons/CardQualityIcon"
import { InfoListCard } from "../generic/InfoListCard"
import { Loader } from "../mui-restyled/Loader"
import { KeyBar } from "../stats/DeckStatsView"
import { statsStore } from "../stats/StatsStore"
import { uiStore } from "../ui/UiStore"
import { AboutGridItem } from "./AboutPage"

@observer
export class SasAndAerc extends React.Component {

    constructor(props: {}) {
        super(props)
        uiStore.setTopbarValues("About", "About", "What it's for and how it works")
    }

    render() {
        const stats = statsStore.stats

        /* eslint react/jsx-key: 0 */
        return (
            <>
                <AboutGridItem>
                    <InfoListCard title={"How SASy is your deck?"} infos={[
                        "My formula calculates a rating for every deck based the quality of its cards and their synergies and antisynergies. " +
                        "This is the deck's SAS rating.",
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Card Ratings</Typography>,
                        "Every card in the game is given a rating between 0 and 4, where 0 is very bad, and 4 is very good. These create the deck's Card " +
                        "Rating.",
                        <div>
                            <Typography>These ratings are represented, from best to worst, by the symbols:</Typography>
                            <div style={{display: "flex", alignItems: "center", marginTop: spacing(1)}}>
                                <CardQualityIcon quality={0} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={0.5} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={1} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={1.5} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={2} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={2.5} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={3} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={3.5} style={{marginRight: spacing(1)}}/>
                                <CardQualityIcon quality={4} style={{marginRight: spacing(1)}}/>
                            </div>
                        </div>,
                        <CardExample
                            text={"Timetraveller is one of the few cards rated 4. Played by itself or with Help from Future Self it consistently provides " +
                            "Aember, a creature, and often replaces itself with its draw effect. " +
                            "Key of Darkness, on the other hand, is one of the few cards rated 0. It provides no aember and is very difficult to use."}
                            img1={"https://cdn.keyforgegame.com/media/card_front/en/341_153_X83CX7XJ5GRX_en.png"}
                            img2={"https://cdn.keyforgegame.com/media/card_front/en/341_273_VHRR6QWG3C3_en.png"}
                        />,
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Card Synergies</Typography>,
                        "Every card is given a list of traits it provides, and synergies and antisynergies it has with card and deck traits.",
                        "Synergies and antisynergies are rated from 1 to 3, with more powerful effects rated higher. A synergy or antisynergy becomes " +
                        "stronger the more instances of its trait that exist in a deck, up to a maximum of 4. At maximum effect you can expect " +
                        "the following increases to total synergy:",
                        <div style={{display: "flex", alignItems: "center"}}>
                            <BelowAverageIcon/>
                            <Typography style={{marginLeft: spacing(1)}}>Level 1 synergy: 0.5</Typography>
                        </div>,
                        <div style={{display: "flex", alignItems: "center"}}>
                            <AverageIcon/>
                            <Typography style={{marginLeft: spacing(1)}}>Level 2 synergy: 1</Typography>
                        </div>,
                        <div style={{display: "flex", alignItems: "center"}}>
                            <AboveAverageIcon/>
                            <Typography style={{marginLeft: spacing(1)}}>Level 3 synergy: 2</Typography>
                        </div>,
                        "Synergy and antisynergy benefits are limited to 2 and -2 per card, to help reflect diminishing returns.",
                        <CardExample
                            text={"Ember Imp and Shadow Self synergize because Ember Imp has a great effect but is easy to kill, and " +
                            "Shadow Self provides protection."}
                            img1={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/ember-imp.png"}
                            img2={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/shadow-self.png"}
                        />,
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>Deck and House Synergies</Typography>,
                        "The app calculates statistics for all decks, like how many creatures are usually in a deck, or whether the creatures are high or " +
                        "low power. Some cards synergize with the traits of a deck, or a house in a deck.",
                        <CardExample
                            text={"Ammonia Clouds damages all creatures, but if your creatures have armor, it can prevent much of the damage dealt by " +
                            "Ammonia clouds. Ammonia Clouds synergizes with decks with high armor."}
                            img1={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/ammonia-clouds.png"}
                            img2={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/staunch-knight.png"}
                        />,
                        <div style={{paddingBottom: spacing(1)}}/>,
                        <Typography variant={"h6"}>SAS (Synergy and AntiSynergy Rating)</Typography>,
                        <DeckScorePill
                            deck={{
                                cardsRating: 75,
                                sasRating: 80,
                                synergyRating: 10,
                                antisynergyRating: 5,
                                sasPercentile: 75.0
                            }}
                        />,
                        "I add together the card ratings, synergy, and antisynergy of a deck to create its SAS rating.",
                        "The system isn't perfect, but it gives a reasonable approximation of the relative quality of decks, and can help you " +
                        "see the useful synergies in your deck, as well as antisynergies to be aware of.",
                        "Please keep in mind this system will never judge decks as accurately as a human, and it will inaccurately judge many decks, " +
                        "especially ones with very complex interactions or strategies. So just because SAS thinks your deck is bad, or average, " +
                        "doesn't mean it is in real play!"
                    ]}/>
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard title={"SAStars"} infos={[
                        "SAStars give you at-a-glance info about the percentile ranking of a deck in terms of SAS among all other decks.",
                        "Unlike SAS, a deck's ranking in terms of SAStars can change at any time if the quality of all registered decks is changed in " +
                        "some way, for example by the release of a new set that is rated better or worse than previous sets.",
                        "SAStars are calculated as follows:",
                        <List>
                            <ListItem><Typography>Top 0.01% of decks (1/10,000) will be 5 gold stars</Typography></ListItem>
                            <ListItem><Typography>Top 0.1% of decks (1/1000) will be 5 stars</Typography></ListItem>
                            <ListItem><Typography>Top 1% of decks (1/100) will be 4.5 stars</Typography></ListItem>
                            <ListItem><Typography>Top 10% of decks will be 4 stars</Typography></ListItem>
                            <ListItem><Typography>Top 25% of decks will be 3.5 stars</Typography></ListItem>
                            <ListItem><Typography>Middle 50% of decks will be 3 stars (Half of all decks)</Typography></ListItem>
                            <ListItem><Typography>Bottom 25% of decks will be 2.5 stars</Typography></ListItem>
                            <ListItem>
                                <Typography>
                                    Bottom 10% of decks will be 2 stars
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography>
                                    Bottom 1% of decks will be 1.5 stars
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography>
                                    Bottom 0.1% of decks will be 1 star
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Typography>
                                    Bottom 0.01% of decks will be 0.5 stars
                                </Typography>
                            </ListItem>
                        </List>
                    ]}/>
                </AboutGridItem>
                <AboutGridItem>
                    <InfoListCard title={"The AERC of your Deck"} infos={[
                        <Typography variant={"h5"}>AERC Deck Traits</Typography>,
                        <div style={{maxWidth: 520, maxHeight: 320}}>
                            {stats ? (
                                <KeyBar
                                    data={[
                                        {x: "Aember Ctrl", y: stats.averageAmberControl},
                                        {x: "Expected Aember", y: stats.averageExpectedAmber},
                                        {x: "Artifact Ctrl", y: stats.averageArtifactControl},
                                        {x: "Creature Ctrl", y: stats.averageCreatureControl},
                                        {x: "Efficiency", y: stats.averageDeckManipulation},
                                        {x: "Disruption", y: stats.averageDeckManipulation},
                                        {x: "Effective Power", y: stats.averageEffectivePower / 10},
                                        {x: "Steal Prevention", y: stats.averageDeckManipulation},
                                        {x: "House Cheating", y: stats.averageDeckManipulation},
                                        {x: "Other", y: stats.averageDeckManipulation},
                                    ]}
                                    domainPadding={60}
                                />
                            ) : <Loader/>}
                        </div>,
                        <div style={{paddingBottom: spacing(2)}}/>,
                        "I've rated every card in key metrics, like its expected Aember Control (A), Expected Aember (E), Artifact Control (R), " +
                        "Creature Control (C), Efficiency (F), Disruption (D), Effective Total Creature Power (P), Steal Prevention (S), " +
                        "House Cheating (H) and Other (O).",
                        "Together these traits form a deck's AERC rating, pronounced \"Arc\" much like aember.",
                        "When added together, these metrics represent the value of a deck converted to Aember. For example, Punch " +
                        "provides one aember, and does damage equal to 1 aember of value. Its net AERC rating and value in a deck is 2.",
                        "When searching for decks you can use these to filter decks and only show decks with strong or weak traits.",
                        <div style={{paddingBottom: spacing(1)}}/>,

                        <AercTraitDescription
                            title={"Aember Control (A)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/routine-job.png"}
                            texts={[
                                "Aember control represents the amount of aember the deck can deny your opponent for forging keys. Lost and stolen aember is " +
                                "counted at a 1:1 ratio, while captured aember and increased key cost is counted at a 2:1 ratio, as those can be reclaimed or " +
                                "avoided."
                            ]}
                        />,
                        <AercTraitDescription
                            title={"Expected Aember (E)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/dust-pixie.png"}
                            texts={[
                                "How much aember you can expect a card to generate. It does not account for creatures reaping unless they have a special " +
                                "ability like Dew Faerie's \"Reap: Gain 1<A>\".",
                                "Some cards that are difficult to play have their base aember reduced, and some cards " +
                                "that immediately allow the use of creatures have aember added."
                            ]}
                        />,
                        <AercTraitDescription
                            title={"Artifact Control (R)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/gorm-of-omm.png"}
                            texts={[
                                "Artifact control is increased by cards that destroy enemy artifacts, or deny your opponent the use of them.",
                                "Destroying an artifact is worth 1.5 points. Using an enemy artifact (destroying single use artifacts) is 1 point. And delaying " +
                                "artifacts is 0.5 points."
                            ]}
                        />,
                        <AercTraitDescription
                            title={"Creature Control (C)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/gateway-to-dis.png"}
                            texts={[
                                "Creature control is increased by cards that damage, destroy, or disable enemy creatures. " +
                                "Special abilities that encourage using a creature to fight contribute extra depending on the ability.",
                                "1 point is approximately equal to destroying one 3 power creature or stunning 2 creatures."
                            ]}
                        />,
                        <AercTraitDescription
                            title={"Efficiency (F)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/library-access.png"}
                            texts={[
                                "Efficiency is increased by effects that allow you to play extra cards. " +
                                "It is reduced by cards that prevent you from playing or drawing cards, like cards that give chains or Bad Penny.",
                                "1 point is approximately equal to drawing two cards or archiving a random card."
                            ]}
                        />,
                        <AercTraitDescription
                            title={"Disruption (D)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/control-the-weak.png"}
                            texts={[
                                "Disruption is increased by effects that reduce the number of cards your opponent can play. " +
                                "1 point is approximately equal to preventing your opponent from drawing 2 cards."
                            ]}
                        />,
                        <AercTraitDescription
                            title={"Effective Power (P)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/mugwump.png"}
                            texts={[
                                "Effective power represents the real usable power of creatures in a deck. Creatures like Grommid, which " +
                                "often cannot be played or used, have their total power reduced. Meanwhile, other cards contribute extra " +
                                "power, like Blood of Titans or Zyzzix the Many.",
                                "Effective power is also increased by Armor at a 1:1 ratio, and other abilities that affect fighting, like elusive, " +
                                "skirmish, hazardous, and assault.",
                                "When included in total AERC score, Effective Power is divided by 10."
                            ]}
                        />,
                        <AercTraitDescription
                            title={"Steal Prevention (S)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/pos-pixies.png"}
                            texts={[
                                "Steal Prevention includes any cards with effects that prevent stealing. This includes obvious cards, like Po's Pixies, " +
                                "as well as Key Cheats (can't steal what you don't have!) and Control the Weak (can't steal with cards you can't play!)"
                            ]}
                        />,
                        <AercTraitDescription
                            title={"House Cheating (H)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/ulyq-megamouth.png"}
                            texts={[
                                "House cheating represents how well a deck can use cards outside of their normal house. For example, Ulyq Megamouth " +
                                "allows you to use a friendly non-mars creature, and increases H. Cards that let you play cards out of house, like Phase " +
                                "Shift, effect efficiency."
                            ]}
                        />,
                        <AercTraitDescription
                            title={"Other (0)"}
                            img={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/shadow-of-dis.png"}
                            texts={[
                                "Other is a catch all for qualities of cards that don't fit into the other AERC traits. It includes 0.3 value per creature for a " +
                                "creature's inherent ability to reap, and unusual effects such as Shadow of Dis."
                            ]}
                        />,
                        <Typography variant={"h5"}>AERC Score (AERC)</Typography>,
                        <Divider/>,
                        "To calculate the AERC score divide Effective Power by 10, then add that with the other AERC scores. " +
                        "The AERC score represents how good a deck is at the core mechanics of " +
                        "the game: generating and controlling aember, controlling artifacts, controlling creatures, " +
                        "drawing cards, and building a board of creatures. It doesn't directly represent how good a deck is.",
                    ]}/>
                    <div style={{marginBottom: spacing(4)}}/>
                    <InfoListCard title={"Using SAS and AERC"} infos={[
                        "SAS estimates the total power of the cards in a deck, and how the synergies and antisynergies effect the deck's quality, but " +
                        "it won't be right about every deck. Many decks have complex combos SAS doesn't take into account, or their component cards " +
                        "and synergies are very good, but they're missing a key overall trait, like sufficient Aember Control.",
                        "Using a combination of SAS, AERC deck traits, and human judgement, it's possible to make an educated guess which of your decks " +
                        "are best, or what would be a good deck to purchase. But even then, the best way to judge the quality of decks will be playing " +
                        "the game!"
                    ]}/>
                </AboutGridItem>
            </>
        )
    }
}

export const AercTraitDescription = (props: { title: string, texts: string[], img: string }) => (
    <div>
        <div style={{display: "flex"}}>
            <div>
                <Typography variant={"h5"} style={{marginBottom: spacing(1)}}>{props.title}</Typography>
                <Divider style={{marginBottom: spacing(1)}}/>
                {props.texts.map((text, idx) => (
                    <div style={{marginBottom: spacing(1)}} key={idx}>
                        <Typography>
                            {text}
                        </Typography>
                    </div>
                ))}
            </div>
            <div>
                <div style={{marginLeft: spacing(2), padding: spacing(2), backgroundColor: "#DDDDDD"}}>
                    <img
                        style={{width: 200}}
                        src={props.img}
                        alt={"Card For Text"}
                    />
                </div>
            </div>
        </div>
        <div style={{paddingBottom: spacing(1)}}/>
    </div>
)


export const CardExample = (props: { text: string, img1: string, img2: string }) => (
    <div style={{padding: spacing(2), backgroundColor: "#DDDDDD"}}>
        <Typography>{props.text}</Typography>
        <div style={{display: "flex", flexWrap: "wrap", marginTop: spacing(2), justifyContent: "center"}}>
            <div>
                <img
                    style={{width: 232, margin: spacing(1)}}
                    src={props.img1}
                    alt={"Card left."}
                />
            </div>
            <div>
                <img
                    style={{width: 232, margin: spacing(1)}}
                    src={props.img2}
                    alt={"Card Right."}
                />
            </div>
        </div>
    </div>
)
