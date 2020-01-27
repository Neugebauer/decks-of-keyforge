import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, List, ListItem, Paper, Typography } from "@material-ui/core"
import Link from "@material-ui/core/Link"
import { ExpandMore } from "@material-ui/icons"
import { observer } from "mobx-react"
import * as React from "react"
import { ArticleInternalLink } from "../articles/ArticleView"
import { CardFilters } from "../cards/CardFilters"
import { cardStore } from "../cards/CardStore"
import { spacing } from "../config/MuiConfig"
import { AboutSubPaths, Routes, StatsSubPaths } from "../config/Routes"
import { BarData, StatsBar } from "../graphs/StatsBar"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { statsStore } from "../stats/StatsStore"
import { DiscordButton, DiscordNamedButton } from "../thirdpartysites/discord/DiscordButton"
import { TwitterButton } from "../thirdpartysites/twitter/TwitterButton"
import { AboutGridItem } from "./AboutPage"

export const latestVersion = "4.13"

const decFirstUpdateCards = new CardFilters()
decFirstUpdateCards.aercHistory = true
decFirstUpdateCards.aercHistoryDate = "2019-12-01"

const NotesLink = (props: { to: string, children: string, style?: React.CSSProperties }) => {
    return <LinkButton style={props.style} to={props.to} variant={"outlined"} color={"primary"}>{props.children}</LinkButton>
}

@observer
export class ReleaseNotes extends React.Component {
    /* eslint react/jsx-key: 0 */
    render() {

        let cardsUpdateLink = null
        const lastUpdate = cardStore.mostRecentAercUpdateDate
        if (lastUpdate != null) {
            cardsUpdateLink = <NotesLink style={{marginTop: spacing(2)}} to={Routes.cardsUpdate(lastUpdate)}>Most Recent Cards Update</NotesLink>
        }

        return (
            <AboutGridItem>
                <Paper style={{padding: spacing(2)}}>
                    <Typography variant={"h5"} style={{marginBottom: spacing(2)}}>Ratings Updates</Typography>
                    <Typography>You can always check out the changes made to AERC ratings for cards on the cards page.</Typography>
                    {cardsUpdateLink}
                </Paper>
                <ReleaseNote
                    releaseNumber={"4.13"}
                    date={"1/27/2020"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "Seller Email Verification",
                            note: "The system will now attempt to verify your public seller's email if you list decks for sale and it is unverified."
                        },
                        {
                            highlight: "Shipping Cost Field",
                            note: "You are now required to detail your shipping costs when listing decks for sale."
                        }
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"4.12"}
                    date={"1/25/2020"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "More sorts and constraints!",
                            note: "Sort by power level, search decks by anomaly count."
                        },
                        {
                            highlight: "Deck Header shows expansion",
                            note: "Also switched card displays to use icons for expansions."
                        }
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"4.11"}
                    date={"1/24/2020"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "Dark Mode for Patrons: Celebrate DoK's 1 year anniversary by supporting the site and saving your eyes at night!",
                        },
                        {
                            note: <NotesLink to={Routes.myProfile}>Switch on your Profile</NotesLink>
                        },
                        {
                            note: <NotesLink to={AboutSubPaths.patreon}>Patron Benefits</NotesLink>
                        },
                        {
                            highlight: "Improvements to deck search panel",
                            note: "Not for sale checkbox. Toggle open or closed the slew of checkboxes. (Most important ones always displayed.) \"For Sale\" searches everything for sale, including auctions. Don't click three checkboxes just to see what's available!"
                        },
                        {
                            highlight: "For Trade is now a profile-level selection",
                            note: "You no longer select \"For Trade\" on a per-listing basis. This is an account-wide setting that toggles for trade on for all decks you have listed for sale from your profile."
                        },
                        {
                            highlight: "Improved deck notes",
                            note: "View deck notes easier! Select to view them from the deck search pane, edit from that page too."
                        }
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"4.10"}
                    date={"1/3/2020"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "New year new SAS Improvements!",
                            note: "I've updated AERC values for about 40 cards. This fine tunes some decks' scores, but won't have a large effect " +
                                "on most decks."
                        },
                        {
                            highlight: "Marketplace improvements pending",
                            note: "As an aside, I'm working on more long-running improvements to the site as a marketplace. " +
                                "Currently working on incorporating an offer system and purchase tracking."
                        },
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"4.9"}
                    date={"11/30/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "Better AERC History",
                            note: `When viewing "Past AERC" on the card search page you can now select specific dates! Should make it much easier to ` +
                                "review changes to AERC."
                        },
                        {
                            highlight: "Extra Weak Traits for AERC",
                            note: "AERC now has extra-weak traits as an option, to help properly synergize cards that synergize a small " +
                                "amount with many types of cards, like many Saurians."
                        },
                        {
                            highlight: "New Traits",
                            note: "I've now added new traits for Good Creature (for cards like Exhume), Captures onto Target for targetted aember capture" +
                                "(for cards like The Callipygian Ideal), and Moves Friendly (for positioning-relevant creatures)."
                        },
                        {
                            highlight: "AERC Update Summary",
                            note: "The biggest difference is that many Saurian sets have dropped a point or two, and some of their " +
                                "more extreme yet misleading Aember control numbers have been toned down. I've also changed the AERC " +
                                "for most house leaders, and made many other minor changes. Take a look in the link below!"
                        },
                        {
                            note: <NotesLink to={Routes.cardSearch(decFirstUpdateCards)}>Updated Cards</NotesLink>
                        },
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"4.8"}
                    date={"11/18/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "SAS by House",
                            note: "You can now hover (click on mobile) a deck's house name to see the SAS contribution from that house, as well as each card's."
                        },
                        {
                            highlight: "Tooltip Improvements",
                            note: "Tooltips on decks should look nicer and be easier to open on mobile. Update: long press for 1 second."
                        }
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"4.7"}
                    date={"11/14/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "Deck Import Improvements",
                            note: "Deck importing now runs separately from the auto import, to help prevent Master Vault from blocking decks getting " +
                                "imported so often. Hopefully the release of set 4 can go a little smoother with decks being fully imported earlier."
                        },
                        {
                            highlight: "AERC Improvements",
                            note: "Various minor improvements to AERC, including fixes to mistakes, and changeds based on impressions from the " +
                                "Indianapolis VT. Also, I had a lot of fun at the vault tour! Great getting to meet new people and the new set."
                        }
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"4.6"}
                    date={"11/6/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "Card to Card Synergies",
                            note: "I'm working on improving the synergy system. To that end, cards can now easily synergize directly with other cards. " +
                                "I've added direct synergies for cards like: "
                        },
                        {
                            note: (
                                <div style={{display: "flex"}}>
                                    <NotesLink to={Routes.cardPage("Drummernaut")} style={{marginRight: spacing(2)}}>Drummernaut</NotesLink>
                                    <NotesLink to={Routes.cardPage("Sic Semper Tyrannosaurus")} style={{marginRight: spacing(2)}}>
                                        Sic Semper Tyrannosaurus
                                    </NotesLink>
                                    <NotesLink to={Routes.cardPage("Cincinnatus Rex")}>Cincinnatus Rex</NotesLink>
                                </div>
                            )
                        },
                        {
                            highlight: "Manual Deck Wins Refresh",
                            note: "If you are logged in, you can now manually refresh power level / chains / wins from Master Vault. Just use the " +
                                "three dots button on the deck view."
                        },
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"4.5"}
                    date={"11/5/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "Saurians Ratings Improvements",
                            note: "There were many cards in Saurians that were causing cards in that house to be overrated. The Spends Captured Aember " +
                                "trait has been removed to combat this. Cards that used to have that trait should synergize based on exalt / capture " +
                                "themselves to represent a more realistic value. Additionally, multiple Saurian cards were overrated in the first place, " +
                                "like Exile (could go up to 6.5 total value), Tribute (4), Crassosaurus (3.8), and others. Further improvements will " +
                                "be made when I add card-to-card synergies and some more deck / house traits."
                        },
                        {
                            highlight: "Improved Card Search",
                            note: "Card searches are now bookmarkable and shareable. Also, the deck or card search will go to the card search " +
                                "page by default if there are card results. I hope to further improve this page's search capabilities in the future."
                        },
                        {
                            highlight: "Improved Deck / Card Search Bar",
                            note: "If you hit enter it will now take you to the card search page if there are any matching card results. Otherwise it will " +
                                "take you to the deck search page."
                        },
                        {
                            highlight: "Reactivated Unregistered Deck Import",
                            note: "This was turned off for the Worlds Collide release. It is now turned back on."
                        },
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"4.4"}
                    date={"10/27/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "Worlds Collide Ratings!",
                            note: "Worlds Collide decks now have SAS ratings. This is just the first version. " +
                                "Saurians especially are a difficult " +
                                "house to rate in the current system, and I expect these initial ratings to improve over the coming weeks and months."
                        },
                        {
                            highlight: "AERC Graphs",
                            note: "I've added new graphs to help visualize AERC stats for cards by set and house."
                        },
                        {
                            note: (
                                <NotesLink to={StatsSubPaths.aercStats}>AERC Stats</NotesLink>
                            )
                        },
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"4.3"}
                    date={"10/23/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "Worlds Collide importing, no scores yet",
                            note: "Worlds Collide decks can now be added to Decks of KeyForge, although due to rate limiting I expect " +
                                "them to be added very slowly by the automatic function. You can try importing them yourself, but that " +
                                "will probably be slow too. SAS scores are being worked on as quickly as possible."
                        }
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"4.2"}
                    date={"10/20/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "SAStars Percent",
                            note: "SAStars now includes a percent. This represents the deck's current percentile ranking among all decks that exist. " +
                                "Unlike SAS, this could change just by virtue of more better or worse decks coming into existence. " +
                                "For example, if a generally higher or lower powered set were released. This also makes it a lot easier " +
                                "to see things like the fact that 62 is the current Average SAS value, as decks with that score are better " +
                                "than 52% of decks."
                        },
                        {
                            highlight: "Rounding Improvements",
                            note: "Most rounding is now out to 2 significant digits, making it more clear what the AERC / SAS numbers really are. " +
                                "You can see unrounded AERC values for the deck on the hover tooltip."
                        },
                        {
                            highlight: "New Decks CSV",
                            note: "I've added a new all-decks CSV for SAS v4. Find it on the About APIs page."
                        }
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"4.1"}
                    date={"10/19/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "SAS v4 Improvements",
                            note: "I've received a lot of feedback in the last few days, and wanted to act on it as quickly as possible. This release " +
                                "includes many fixes and improvements to the synergies of cards. Arise is no longer super overrated. Wild Wormhole is " +
                                "less underrated. Many cards have had their synergies fixed, like Key Abuduction, John Smyth, and others. " +
                                "You can see " +
                                "all the changes using the history toggle on the cards page. The previous versions are now dated so you can recognize " +
                                "when an update was released."
                        },
                        {
                            highlight: "SAS v4 Fixes",
                            note: "A bug snuck in late in the development process of SAS v4 and caused many decks to be off by a couple points from their " +
                                "proper total SAS. Some decks were off by many points. Any cards with only synergies and no antisynergies were gaining " +
                                "extra points in the total SAS score, and any cards with only antisynergies were losing points. Fixing this problem has " +
                                "led to a much tighter (and more realistic) band of possible scores. From 38 to 93, with an average of 62. " +
                                "I also fixed an issue where some cards were synergizing out of house when they shouldn't have, like Shooler synergizing " +
                                "with Key Abduction's bounce effect. "
                        },
                        {
                            highlight: "SAS v4 Win Rate Correlation",
                            note: "In its first release a few days ago, SAS v4 was equivalent to SAS v3 in terms of correlation with win rates. This " +
                                "update improves upon that thanks to the synergy improvements and bug fixes. At approximately 50 and 75 SAS this version " +
                                "is about 1.5% more strongly correlated than the previous version."
                        },
                        {
                            highlight: "Fixes to Synergy Details Table",
                            note: "Multiple fixes to this table. Sorting works now. Out of house synergies show the cards they synergize with. Table is " +
                                "more medium-screen size friendly."
                        },
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"4.0"}
                    date={"10/16/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "SAS v4 Released!",
                            note: "The biggest revision to SAS ever is now complete. AERC traits now have synergies, and those synergies / antisynergies + " +
                                "the raw AERC score = the new SAS. This means all decks have had their scores shifted significantly. Scores are lower " +
                                "across the board, usually in the range of 5 to 20 points lower. 63 is now the average SAS rating."
                        },
                        {
                            note: "This change was made made to improve AERC and SAS. AERC and SAS are both strong rating systems, but rating deck quality " +
                                "based on Aember equivalent value provides a consistent basis for rating decks across sets, and makes it easier to " +
                                "rate cards more accurately. Adding synergies to AERC stats makes AERC stats a much more realistic evaluation of the " +
                                "traits of a deck. And changing the Synergy and Antisynergy system to have a dynamic range per card, instead of the set " +
                                "-2 to 2 range as it previously did, improves the accuracy and flexibility of the system. The SAS + AERC page has been " +
                                "revised based on these changes. Please review that for more details about how the new system works!"
                        },
                        {
                            note: (
                                <NotesLink to={AboutSubPaths.sas}>SAS and AERC</NotesLink>
                            )
                        },
                        {
                            highlight: "New Ratings show immediately, searches update slowly",
                            note: "It will take multiple hours or days for all the decks to finish updating for the new ratings. During that time " +
                                "all decks will show their new ratings, but search results will be inconsistent (some decks will use their old ratings in " +
                                "searches until done updating)."
                        },
                        {
                            highlight: "Improved Synergy Information",
                            note: "On hover / click of cards in a deck list you can see the AERC range of the card, as well as the specific rating for that " +
                                "card in that deck. Also, in the Deck Page Synergy Details table you can see what percent synergy each card's synergies has, " +
                                "and on hover you can see what cards each synergy is synergizing with."
                        },
                        {
                            highlight: "Historical AERC changes",
                            note: "Starting now, you can also view past AERC values on the cards page. Just click the toggle at the bottom and you will see " +
                                "previous and current AERC ratings for the card."
                        },
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"3.30"}
                    date={"10/12/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "Working on SAS update Step 4 + Bug",
                            note: "I'm working on the Step 4 of the big SAS update, but there is a bug with some decks recently added and their effective " +
                                "power. Their effective power and total AERC will be lower than they should be until I can finish Step 4 and update AERC " +
                                "in general, hopefully later this weekend or early next week."
                        },
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"3.29"}
                    date={"10/4/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "Worlds Collide Spoilers",
                            note: "I teamed up with some folks in the Sanctumonius Discord to provide Worlds Collide spoilers " +
                                "on DoK! They were very generous in providing a data set to build the spoilers from. " +
                                "Join their discord to discuss the new spoilers, and take a look at them here!"
                        },
                        {
                            note: (
                                <div style={{display: "flex"}}>
                                    <NotesLink to={Routes.spoilers}>Worlds Collide</NotesLink>
                                    <DiscordNamedButton name={"Sanctumonius"} link={"https://discord.gg/3dSVb6v"} style={{marginLeft: spacing(2)}}/>
                                </div>
                            )
                        }
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"3.28"}
                    date={"9/30/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "Opt-in Crucible Tracker Wins",
                            note: "I had multiple users concerned about the crucible tracker wins being displayed by default. " +
                                "Due to these concerns, I've made this an opt-in feature. Please enable it in your " +
                                "profile if you would like to see these stats."
                        },
                        {
                            note: (
                                <div style={{display: "flex"}}>
                                    <NotesLink to={Routes.myProfile}>Profile</NotesLink>
                                </div>
                            )
                        }
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"3.27"}
                    date={"9/25/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "Crucible Tracker Wins",
                            note: "You can now see the wins and losses for decks from results recorded with Crucible Tracker! Click the icon to go to the " +
                                "deck page on Crucible Tracker."
                        },
                        {
                            highlight: "Improved App Bar",
                            note: "App bar now shows decks and my decks for smaller resolution desktops."
                        },
                    ]}
                />
                <ReleaseNote
                    releaseNumber={"3.26"}
                    date={"9/22/2019"}
                    expanded={true}
                    releaseNotesWithHighlights={[
                        {
                            highlight: "AERC Update",
                            note: "Major update to AERC card scores! I've gone through and trued AERC scores against SAS card ratings to improve AERC " +
                                "scores. " +
                                "I've also made AERC scores more internally consistent, for example fight effects are rated the same for similar power " +
                                "creatures. This completes step 3 of the 4 step SAS revision plan."
                        },
                        {
                            highlight: "Card Table View + Spreadsheet",
                            note: "Card table view and spreadsheet download! Find a link to the previous AERC ratings csv below."
                        },
                        {
                            note: (
                                <div style={{margin: spacing(1)}}>
                                    <Link href={"https://docs.google.com/spreadsheets/d/1BQ-PB1btHAyc38Dr4RXIFbuTm4oMkTAM_x7rGo5IMnc/edit?usp=sharing"}>
                                        All cards spreadsheet pre-major AERC scores revision
                                    </Link>
                                </div>
                            )
                        },
                        {
                            highlight: "Deck Sale Listing Defaults",
                            note: "Save defaults when listing decks for sale! No more re-entering the same thing to list 10 similar decks."
                        },
                        {
                            highlight: "SAS / AERC Update Message",
                            note: "Message while SAS / AERC are updating. Now you know when things are in flux."
                        },
                        {
                            highlight: "Card Type Hover",
                            note: "Hover for card totals shows names of cards that match the type."
                        },
                    ]}
                />
                <ReleaseNote releaseNumber={"3.25"} date={"9/11/2019"} expanded={true} releaseNotes={[
                    "Make sure to check out the toggle buttons on the bottom of the deck search drawer! I added a new graph one to see some graphs on " +
                    "the deck search screen!",
                    "Big changes to AERC! Multiple new Aerc stats, including Aember Protection (cards like Vault Keeper and key cheats), House Cheating " +
                    "(Dominator Bauble), and Other (things that don't fit elsewhere). Also split Deck Manipulation into Efficiency (can play more cards) " +
                    "and Disruption (stop your opponent from playing more cards).",
                    "Along with those changes come handy new icons and AERC displays. I've added references to the AERC letters in many places, because " +
                    "I don't want that lingo to go away, but for the primary deck display I want some easy to recognize icons.",
                    "Also added some radar graphs to show the percentile rankings of a deck's traits and card types!",
                    "Added Raw Aember as a deck search constraint. Had been getting a lot of requests for this one. Each constraint adds technical " +
                    "overhead, but this seemed worth it.",
                    "Improved the stats page. The graphs exclude data with very small counts, and display quantity of data available."
                ]}/>
                <ReleaseNote releaseNumber={"3.24"} date={"8/24/2019"} expanded={true} releaseNotes={[
                    "Download deck lists as a spreadsheet file! Switch to the table view (toggle button at the bottom of the search bar) and click the " +
                    "download button.",
                    "Deck table view now has a three dots button to perform most of the normal actions for a deck directly from the table.",
                    "Added Master Vault link to the more options button for decks."
                ]}/>
                <ReleaseNote releaseNumber={"3.23"} date={"8/23/2019"} expanded={true} releaseNotes={[
                    "Added rate limiting for the deck request API. Some users were misusing this resource. Please use the CSV if you need all SAS / AERC " +
                    "ratings.",
                    "If you are the high bidder on an auction and someone else buys the auction with buy it now, you will receive an email."
                ]}/>
                <ReleaseNote releaseNumber={"3.22"} date={"8/22/2019"} expanded={true} releaseNotes={[
                    "Minor improvement to SAS / AERC. These are some lingering changes to the current system I wanted to get out before I start " +
                    "working on the big update.",
                    "Fixed problems like Shadow of Dis having Aember Control instead of Expected Aember.",
                    "Increased rating for a few cards, like Mother, Succubus, Shatter Storm, Rock Hurling Giant, Door Step to Heaven, Tyxl Beambuckler, " +
                    "Nyzyk Resonator, Martyr's End, and Persistence Hunting.",
                    "Reduced rating for a few cards, like Into the Fray, Grumpus Tamer, Bloodshard Imp, Gold Key Imp, Memory Chip, AEmber Conduction Unit, " +
                    "Nightforge, Guard Disguise, and Scowly Caper.",
                    "Improved constraints + cards search. It should be more clear how to add more, and possible to remove lines without resetting the whole " +
                    "search.",
                    "A few minor bug fixes, like to the tooltips for stars."
                ]}/>
                <ReleaseNote releaseNumber={"3.21"} date={"8/20/2019"} expanded={true} releaseNotes={[
                    "Introducing SAStars! These stars are a quick way to know the percentile ranking of a deck by SAS. Check out the new About page section " +
                    "for more info on what they mean. (Scroll down for the SAStars section.)",
                    <NotesLink style={{margin: spacing(1)}} to={AboutSubPaths.sas}>About SAStars</NotesLink>,
                    "And some special preview news! I've begun the process of the biggest revision to SAS since its release. Plan is to have this complete " +
                    "before the release of Set 3.",
                    "In short, I'm planning on adding more traits to AERC (Aember Protection, splitting Deck Manipulation into Efficiency and Disruption , " +
                    "House Cheating, Other), adding synergies and antisynergies to improve AERC values, and then replacing the SAS card ratings with total " +
                    "AERC score of cards.",
                    "If you want to read the in-depth road map, take a look at the google doc: ",
                    <div style={{margin: spacing(1)}}>
                        <Link href={"https://docs.google.com/document/d/1_Hg1K2XI2vViDyJUECsmiIyAeYsCMvTHys46dVvKETA/edit?usp=sharing"}>
                            SAS v6 Roadmap
                        </Link>
                    </div>,
                    "Send me a message on Discord or Twitter to provide feedback and comments!",
                    <div>
                        <DiscordButton/>
                        <TwitterButton style={{marginLeft: spacing(2)}}/>
                    </div>,
                ]}/>
                <ReleaseNote releaseNumber={"3.20"} date={"8/14/2019"} expanded={true} releaseNotes={[
                    "The top search tool is a lot cooler now! Displays relevant info about the decks. It will also search for cards and displays info about " +
                    "them, and let you click to see the full page for the card.",
                    "Also wanted to mention the Gen Con Vault Tour was awesome! Was exciting getting to see the upcoming set previewed, and everyone I met " +
                    "and played against was friendly and cool. I wish I could've made one of the day 2s, but my losses were against great decks and players, " +
                    "so nothing to complain about!"
                ]}/>
                <ReleaseNote releaseNumber={"3.19"} date={"8/13/2019"} expanded={true} releaseNotes={[
                    "Improved cards page. The cards page now loads much faster, loads more cards on scroll, and you can link to individual pages for " +
                    "cards.",
                    "Add notes to any deck, and use your notes as custom tags to share collections of decks with a link! You can search for " +
                    "decks with note text you've added, and share those search result URLs with others.",
                    "Deck action buttons have been improved. Less used actions (view cards, add note) are in a three vertical dots menu, and in mobile " +
                    "most deck actions will appear there for a simpler, shorter mobile view."
                ]}/>
                <ReleaseNote releaseNumber={"3.18"} date={"6/30/2019"} expanded={true} releaseNotes={[
                    "Updated SAS. Added some new traits, like Deploy and an Out of House synergy type. (Synergizes with traits from cards in other houses " +
                    "only. Also fixed some issues, like the Thief trait not working.",
                    "Highlights of the update for AoA: ",
                    <List>
                        <ListItem><Typography>Foozle 2 -> 3</Typography></ListItem>
                        <ListItem><Typography>Into the Fray 3 -> 1.5</Typography></ListItem>
                        <ListItem><Typography>Onyx Knight 2 -> 3</Typography></ListItem>
                        <ListItem><Typography>Archimedes 2.5 -> 3.5</Typography></ListItem>
                        <ListItem><Typography>Lion Bautrem 2 -> 3</Typography></ListItem>
                        <ListItem><Typography>Opal Knight 2 -> 3</Typography></ListItem>
                        <ListItem><Typography>Panpaca, Anga 1.5 -> 2.5</Typography></ListItem>
                        <ListItem><Typography>Po's Pixies 2 -> 3</Typography></ListItem>
                    </List>
                ]}/>
                <ReleaseNote releaseNumber={"3.17"} date={"6/28/2019"} expanded={true} releaseNotes={[
                    "You can now search for a number of copies of any cards. For example, you could search for decks with 1 of Key Charge, Chota Hazri, or " +
                    "Key Abduction.",
                    "Added a search field to the top bar. Should help for quick deck name searches!"
                ]}/>
                <ReleaseNote releaseNumber={"3.16"} date={"6/20/2019"} expanded={true} releaseNotes={[
                    "Updated description and terms for auction bidding and listing. Sniping is actively discouraged, and if server slowness or instability " +
                    "significantly affects the ability of users to bid on an auction, sellers are allowed to relist that auction with a description " +
                    "explaining why.",
                    "Fixed bugs with card sorting for AoA.",
                    "More info on mobile deck view.",
                    "Email verification will now be required for listing decks for sale, and soon for other activities.",
                    "Fixed win / loss / power level / chain updater. It now runs every 3 days, and takes more than a day to complete.",
                    "I had a great time at the Origins Vault Tour! Opened one good deck with a super cool maverick and made top 16.",
                    <ArticleInternalLink internalLink={`/decks/409dce8d-839d-4bd9-9994-dca5e1573e3b`} text={"Denim, Perfumed Province Rook"}/>,
                    "Also was great getting to meet many people who use SAS and the site, as well as Brad Andres! Brad was telling someone that if anyone, " +
                    "tells them they can tell them how good their deck is, they're lying. So a friend (thanks Erich) immediately introduced me, " +
                    `"Speaking of which, I wanted to introduce you to Nathan. He makes Decks of KeyForge and SAS!" So I said, "Hi, I've lied to ` +
                    `KeyForge players hundreds of thousands of times." Was a pretty funny introduction!`
                ]}/>
                <ReleaseNote releaseNumber={"3.15"} date={"6/9/2019"} expanded={true} releaseNotes={[
                    "Moved Expansion selector down to above search bar to improve spacing on deck search.",
                    "Added a sellers view to make it more convenient for sellers to use the table view to update prices and unlist decks.",
                    "When listing an auction you can now select the time it will end.",
                    "Improved stability by improving the deck statistics update function."
                ]}/>
                <ReleaseNote releaseNumber={"3.15"} date={"6/5/2019"} expanded={true} releaseNotes={[
                    "Refined card ratings and synergies for AoA.",
                    "Improved deck importer to better keep up with quantity of decks.",
                    "Cards sorted in a CotA style for AoA decks."
                ]}/>
                <ReleaseNote releaseNumber={"3.14"} date={"6/1/2019"} expanded={true} releaseNotes={[
                    "In the process of adding separate stats for expansions.",
                    "Improved deck importer to better keep up with quantity of decks.",
                    "I haven't made changes yet, but I'll be updating and improving SAS ratings for AOA as I get more familiar with the set. " +
                    "While I do think AOA is weaker in general than COTA, and will have generally lower scores, I think it's being a bit underrated " +
                    "by SAS at this time."
                ]}/>
                <ReleaseNote releaseNumber={"3.13"} date={"5/31/2019"} expanded={true} releaseNotes={[
                    "Age of Ascension traits, synergies, and antisynergies have been added! There are still some new synergies in AoA that are not yet " +
                    "represented, like an automatic anti-synergy for multiple copies of the Alpha keyword in the same house.",
                    "Revised Bait and Switch as well as Library Access. Despite it being unfortunate that they needed to do it, I'm personally excited about " +
                    "the wider array of decks now viable in top-level competitions.",
                    "A long time ago I added C (Creature Control) rating to high power creatures. I was supposed to remove that when I added Effective " +
                    "Power, but instead those C ratings were incompletely removed. They are now completely removed, so cards like Shooler don't have a C " +
                    "rating.",
                    "Legacy symbols now show up next to decks with legacy cards.",
                    "Fixed an issue with notifications not being sent for newly listed auctions."
                ]}/>
                <ReleaseNote releaseNumber={"3.12"} date={"5/29/2019"} expanded={true} releaseNotes={[
                    "Age of Ascension decks are now importing into Decks of KeyForge! Note that these decks have SAS ratings, but those should be " +
                    "taken with a huge grain of salt. I haven't had time to add traits, synergies or antisynergies yet, so Age of Ascension decks will " +
                    "also have lower scores than they should."
                ]}/>
                <ReleaseNote releaseNumber={"3.11"} date={"5/26/2019"} expanded={true} releaseNotes={[
                    `Search for cards as mavericks in a specific house! Just use the "Copies" drop down and select the house you want.`,
                    "New article previewing SAS ratings for many of the known cards coming out in Age of Ascension!"
                ]}/>
                <ReleaseNote releaseNumber={"3.10"} date={"5/22/2019"} expanded={true} releaseNotes={[
                    "Added expansion selectors. The one for cards will show you the COTA cards included in AOA!",
                    "Can add filter on number of chains.",
                    "Temporarily removing house select and recently listed sort to try to improve recent performance issues. " +
                    "Also converted the total deck count to be an estimate that is much faster to calculate, but also isn't necessarily exactly how many " +
                    "decks exist."
                ]}/>
                <ReleaseNote releaseNumber={"3.9"} date={"5/19/2019"} expanded={true} releaseNotes={[
                    "AERC now has tool tips that tell you what cards contributed to each score.",
                    "You will receive an email notification when outbid on an auction.",
                    "Added a button to go to a random registered deck."
                ]}/>
                <ReleaseNote releaseNumber={"3.8"} date={"5/18/2019"} expanded={true} releaseNotes={[
                    "Updates to SAS and AERC! Please note the stats will be out of date temporarily. " +
                    "This will be the last big change before Age of Ascension.",
                    "The following are the changes to SAS ratings: ",
                    (
                        <List>
                            <ListItem><Typography>Brothers in Battle 2.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Punch 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Banner of Battle 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Pile of Skulls 2 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Bilgum Avalanche 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Bumpsy 2.5 -> 3</Typography></ListItem>
                            <ListItem><Typography>Ganger Chieftan 2 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Grenade Snib 2 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Lomir Flamefist 3 -> 2</Typography></ListItem>
                            <ListItem><Typography>Looter Goblin 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Rogue Ogre 2.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Troll 3 -> 2</Typography></ListItem>
                            <ListItem><Typography>Valdr 1.5 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>Phoenix Heart 1 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>A Fair Game 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Control the Weak 3 -> 4</Typography></ListItem>
                            <ListItem><Typography>Tendrils of Pain 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Mind Barb 2 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Three Fates 3.5 -> 3</Typography></ListItem>
                            <ListItem><Typography>Key to Dis 3 -> 3.5</Typography></ListItem>
                            <ListItem><Typography>Ember Imp 2 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Succubus 2 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Master of 2/3 3 -> 2</Typography></ListItem>
                            <ListItem><Typography>Collar of Subordination 3.5 -> 3</Typography></ListItem>
                            <ListItem><Typography>Flame-Wreathed 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Effervescent Principle 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Knowledge is Power 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Phase Shift 3 -> 3.5</Typography></ListItem>
                            <ListItem><Typography>Scrambler Storm 3 -> 3.5</Typography></ListItem>
                            <ListItem><Typography>Crazy Killing Machine 1.5 -> 1</Typography></ListItem>
                            <ListItem><Typography>The Howling Pit 1.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Brain Eater 2.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Ganymede Archivist 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Titan Mechanic 2.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Vespilon Theorist 2.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Experimental Therapy 1 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>Martians Make Bad Allies 1.5 -> 1</Typography></ListItem>
                            <ListItem><Typography>Sample Collection 1 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>Shatter Storm 1.5 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Feeding Pit 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Invasion Portal 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Ether Spider 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Mindwarper 1.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Phylyx the Disintegrator 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Brain Stem Antenna 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Charge! 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Clear Mind 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Mighty Lance 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Oath of Poverty 1.5 -> 1</Typography></ListItem>
                            <ListItem><Typography>Shield of Justice 1 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>Terms of Redress 1.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>The Harder They Come 1.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Horseman of Famine 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Jehu the Bureaucrat 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Staunch Knight 1 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>Gatekeeper 1.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Routine Job 3 -> 3.5</Typography></ListItem>
                            <ListItem><Typography>Treasure Map 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Noddy the Thief 2.5 -> 2</Typography></ListItem>
                            <ListItem><Typography>Shadow Self 2.5 -> 3</Typography></ListItem>
                            <ListItem><Typography>Umbra 1.5 -> 1</Typography></ListItem>
                            <ListItem><Typography>Duskrunner 1 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Grasping Vines 3 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Lifeweb 2 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Perilous Wild 3 -> 2</Typography></ListItem>
                            <ListItem><Typography>Giant Sloth 2 -> 1.5</Typography></ListItem>
                        </List>
                    ),
                    "Also, the system for how AERC estimates artifact control has been adjusted. Now hard artifact removal like Sneklifter, or " +
                    "Neutron Shark provides 1.5 R, artifact use (removing one-use artifacts) like Remote Access or Nexus provides 1 R, and artifact delay " +
                    "like Barehanded or Grasping Vines provides 0.5 R.",
                    "You can now view only your decks that are not for sale via the top menu.",
                    "I've also begun the under-the-hoods preparations for the release of Age of Ascension."
                ]}/>
                <ReleaseNote releaseNumber={"3.8"} date={"5/11/2019"} releaseNotes={[
                    "New deck view with more info! You can use the expand less button to return to the old view.",
                    "Table view now has a ton of new columns. You can see a smaller table view using the top right button.",
                    "Fixed an issue causing new patreon subscribers to not gain their benefits."
                ]}/>
                <ReleaseNote releaseNumber={"3.7"} date={"4/22/2019"} releaseNotes={[
                    "Auctions added as a selling and buying option!",
                    "Choose a currency symbol on your profile so you can sell your decks with € or any other currency.",
                    "Select a deck language when selling a deck to help users know what language your deck is in. This " +
                    "defaults to English, so be sure to set it to another language if needed."
                ]}/>
                <ReleaseNote releaseNumber={"3.6"} date={"4/8/2019"} releaseNotes={[
                    "Real Patron rewards! " +
                    "First one is pretty sweet. Become a $5 a month patron to save deck searches, and get email notifications when new " +
                    "decks are listed for sale or trade that match your search.",
                    `If you're a seller, you can become a $10 a month patron to have your "Store" link be featured on the landing page with a custom ` +
                    "store name and picture. (Please email me a 48px height image to get a custom image.)",
                    "Speaking of which, there's a new landing page! You won't need to wait to see the same top SAS decks you've seen a 100 times before " +
                    "anymore. It also provides some suggested deck searches, featured sellers, articles, and a couple graphs.",
                    "I've added a new public API for getting the stats used to build the charts and graphs on this site."
                ]}/>
                <ReleaseNote releaseNumber={"3.5"} date={"4/2/2019"} releaseNotes={[
                    "Created an articles section with two new articles by Dunkoro and Big Z! If you're interested in contributing articles send me a " +
                    "short summary of your idea and an example paragraph. But keep in mind I'm going to be selective about what articles are added to the site."
                ]}/>
                <ReleaseNote releaseNumber={"3.4"} date={"3/27/2019"} releaseNotes={[
                    "Synergy Details table now includes all cards, AERC scores, and is sortable in desktop mode.",
                    "Deck name search now ignores punctuation."
                ]}/>
                <ReleaseNote releaseNumber={"3.3"} date={"3/14/2019"} releaseNotes={[
                    "Added two new AERC traits, deck manipulation and effective creature power. Read more about them on the SAS and AERC about page!",
                    "Added those two new traits to the total AERC score. This causes a major change to those scores.",
                    "Minor update to SAS based on latest card win rates. No card was changed by more than 0.5 card rating.",
                    "You can now search by card quantity \"none\" to exclude cards you don't want.",
                    "Added new \"filter on\" options to deck search. You can now filter on deck manipulation, effective creature power, as well as " +
                    "card type quantity."
                ]}/>
                <ReleaseNote releaseNumber={"3.2"} date={"3/5/2019"} releaseNotes={[
                    `Europeans rejoice! You can now select "Buying Countries" in your profile. When you search decks for sale, these will be used instead of ` +
                    "your home country for searching.",
                    "Fixed a bug that could prevent users from removing a deck from their decks.",
                    `Added an "Import to my decks" option to the import deck popover.`
                ]}/>
                <ReleaseNote releaseNumber={"3.1"} date={"3/3/2019"} releaseNotes={[
                    "You can set page size when searching decks to be 100. Look at the bottom of the deck search drawer!",
                    `When searching decks for sale you can set a "Listed Within Days" limit to see only more recently listed decks.`,
                    "Updated AERC stats to give credit in the C category to creatures with high power. 5-6 power provides 0.5 C, while 7+ " +
                    "is typically 7+. Also made minor improvements to other AERC stats of cards.",
                    "Added a total AERC score, along with sorting and constraining by that."
                ]}/>
                <ReleaseNote releaseNumber={"3.0"} date={"2/25/2019"} releaseNotes={[
                    "TLDR; Updated SAS and added win rates for cards on the cards page.",
                    "This is a major revision to SAS ratings. I've used win rates of cards from the official API to inform my card ratings for SAS. I have " +
                    "followed the win rates for commons more close than uncommons or rares due to the larger amount of data.",
                    "I've also added new tiers to the card ratings, which include 0.5, 1.5, 2.5 and 3.5 for more precision in rating.",
                    "These changes have changed the scale of SAS somewhat. 75 is still pretty close to average, but the scale has widened. " +
                    "There are now 105 SAS decks (rather than 102) and 39 SAS decks (rather than 45).",
                    "Some of the major card rating changes include (keep in mind synergies can make the value in a deck go up or down):",
                    (
                        <List>
                            <ListItem><Typography>Relentless Assault 1 -> 3</Typography></ListItem>
                            <ListItem><Typography>Hebe the Huge 3 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Key Hammer 2 -> 0.5</Typography></ListItem>
                            <ListItem><Typography>Restringuntus 1 -> 3</Typography></ListItem>
                            <ListItem><Typography>Emp Blast 3 -> 1.5</Typography></ListItem>
                            <ListItem><Typography>Gatekeeper 4 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Total Recall 3 -> 1</Typography></ListItem>
                            <ListItem><Typography>Safe Place 1 -> 2.5</Typography></ListItem>
                            <ListItem><Typography>Save the Pack 2 -> 0.5</Typography></ListItem>
                        </List>
                    ),
                    "Many more have been changed by 0.5 or 1 point. You can see the previous spreadsheet in the 2.0 release notes, and compare to this one.",
                    <a href={"https://docs.google.com/spreadsheets/d/1NpRMo_uZcOh8EkiYTvSQZOPHgfAEDU88rd7VuBDkgwQ/edit?usp=sharing"}>
                        Card Ratings v3 Spreadsheet
                    </a>,
                    "Also, you can see the win ratings for cards on the Cards page, and sort by win rating. The ratings are pretty interesting, but need " +
                    "to be taken with a huge grain of salt. First, they are highly correlated with house win rates. Shadows wins the most, so all its cards " +
                    "rate high, and Mars wins the least, so all its rate low. I've used the range of ratings intra-house more than I've compared across " +
                    "houses.",
                    "Added a global stats page.",
                    (
                        <div style={{display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
                            {statsStore.stats == null ? <Loader/> : (
                                <StatsBar name={"SAS v3 Win Rate"} data={statsStore.stats.sasWinRate} small={true} yDomain={[0, 100]}/>
                            )}
                            <StatsBar name={"SAS v2 Win Rate"} data={sasV2BarData} small={true} yDomain={[0, 100]}/>
                        </div>
                    )
                ]}/>
                <ReleaseNote releaseNumber={"2.7"} date={"2/20/2019"} releaseNotes={[
                    "More graphs for the deck page. Click the expansion button to see them!",
                    "Site notifies you of new releases.",
                    "Improved Patreon page."
                ]}/>
                <ReleaseNote releaseNumber={"2.6"} date={"2/16/2019"} releaseNotes={[
                    "Cards view for deck that shows all the cards.",
                    "Sellers and traders can now update the listing for their decks.",
                    "Added an asking price deck search filter if \"For Sale\" is selected."
                ]}/>
                <ReleaseNote releaseNumber={"2.5"} date={"2/15/2019"} releaseNotes={[
                    "Page titles now change with the pages.",
                    "Created an API for stores or technically saavy sellers to list and unlist decks.",
                    "Updated the About page. Still as meta as the first time!"
                ]}/>
                <ReleaseNote releaseNumber={"2.4"} date={"2/12/2019"} releaseNotes={[
                    "Improved card search! Faster, and you can search up to 5 different cards.",
                    "Searching decks for sale will display sale info directly in the deck search."
                ]}/>
                <ReleaseNote releaseNumber={"2.3"} date={"2/7/2019"} releaseNotes={[
                    "You can send an email to sellers and traders if you are logged in and they have not listed an external link for the deck.",
                    "You can now select a country for yourself and filter decks for sale or trade by the country they are listed in. Note that " +
                    "as of this release, no decks have a country selected, but all future decks listed for sale or trade will."
                ]}/>
                <ReleaseNote releaseNumber={"2.2"} date={"2/3/2019"} releaseNotes={[
                    "Added power level, chains, wins, and losses to decks, and sorting by chains.",
                    "You can now add unregistered decks to discover their SAS and list them for sale! Just login and go to Import Deck, then use the link.",
                    "By default unregistered decks are filtered out of searches.",
                    "Traits are colored teal to differentiate from synergies.",
                    "Improved the simple deck API to v2, see below.",
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Typography>Added a</Typography>
                        <NotesLink style={{marginLeft: spacing(1)}} to={Routes.privacyPolicy}>Privacy Policy</NotesLink>
                    </div>
                ]}/>
                <ReleaseNote releaseNumber={"2.1"} date={"1/29/2019"} releaseNotes={[
                    "You can now view decks in a table view with column sorting.",
                    "Added password reset.",
                    "Created a Patreon page with some donation options to help support the site!"
                ]}/>
                <ReleaseNote releaseNumber={"2.0"} date={"2/27/2019"} releaseNotes={[
                    "Updated SAS Ratings.",
                    "The ratings of card + card synergies has been reduced in many instances. People felt that the system was over weighting " +
                    "the increased value of how cards work together when often they don't both appear in the same game, or at the wrong time.",
                    "Increased ratings of cards that increase expected aember, aember control, and creatures that help develop board control.",
                    "Added an \"Expected Aember\" deck trait synergy and synergies with it.",
                    "Added synergies, antisynergies, and changed card ratings based on community feedback.",
                    "You can view the ratings as spreadsheets on google docs. (Although I recommend toggling on full view on the Cards page for the " +
                    "current version.)",
                    <a href={"https://docs.google.com/spreadsheets/d/1v8YYw1uTaZc_G01pFqbofgYsvKP2lADEs-5-SqGR6LY/edit?usp=sharing"}>
                        Card Ratings v2 Spreadsheet
                    </a>,
                    <a href={"https://docs.google.com/spreadsheets/d/16gdzgD9Z3S6bb8NJbJCQ0A-mcOnznQnqV2wFoJublbs/edit?usp=sharing"}>
                        Card Ratings v1 Spreadsheet
                    </a>,
                    "",
                    "Added expiration date for deck listings."
                ]}/>
                <ReleaseNote releaseNumber={"1.4"} date={"1/22/2019"} releaseNotes={[
                    "New graphs on deck page to show deck scores relative to global averages.",
                    "Added SAS and Cards Rating options to the deck search filters.",
                    "Fix for vague error on registration page.",
                ]}/>
                <ReleaseNote releaseNumber={"1.3"} date={"1/21/2019"} releaseNotes={[
                    `Added "My Favorites" to deck search options. Changed "Wishlist" to favorites, but it can be used for either.`,
                    "Added card popovers with expanded details to Synergy Details.",
                    "Improved release notes. Whoa so meta!",
                    "Fixed some bugs, like when the site is linked to from Facebook."
                ]}/>
                <ReleaseNote releaseNumber={"1.2"} date={"1/20/2019"} releaseNotes={[
                    "Fixed problem with user registration."
                ]}/>
                <ReleaseNote releaseNumber={"1.1"} date={"1/20/2019"} releaseNotes={[
                    "I've temporarily disabled searching for more than one card in the deck search. It was possible to create long-running searches " +
                    "that had the potential to bring down the database.",
                    "Fixed a bug where average artifact control and creature control were showing average artifact count and creature count."
                ]}/>
                <ReleaseNote releaseNumber={"1.0"} date={"1/19/2019"} releaseNotes={[
                    <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                        <img alt={"Key of Darkness"} src={`https://cdn.keyforgegame.com/media/card_front/en/341_273_VHRR6QWG3C3_en.png`}/>
                    </div>
                ]}/>
            </AboutGridItem>
        )
    }
}

export const ReleaseNote = (props: {
    releaseNumber: string,
    releaseNotes?: React.ReactNode[],
    releaseNotesWithHighlights?: { note?: React.ReactNode, highlight?: string }[],
    expanded?: boolean,
    date: string
}) => (
    <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
            <div style={{display: "flex", alignItems: "flex-end", width: "100%"}}>
                <Typography color={"primary"} style={{flexGrow: 1}} variant={"h6"}>{props.releaseNumber}</Typography>
                {props.date ? (
                    <Typography color={"primary"} variant={"subtitle1"}>{props.date}</Typography>
                ) : null}
            </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <div style={{width: "100%"}}>
                {props.releaseNotesWithHighlights && props.releaseNotesWithHighlights.map((noteAndHighlight, idx) => {
                    let note
                    if (typeof note === "string") {
                        note = (
                            <Typography
                            >
                                {noteAndHighlight.note}
                            </Typography>
                        )
                    } else {
                        note = noteAndHighlight.note
                    }
                    return (
                        <div
                            key={idx}
                            style={{marginTop: idx !== 0 ? spacing(1) : undefined}}
                        >
                            {
                                noteAndHighlight.highlight &&
                                <Typography variant={"subtitle1"} style={{fontWeight: "bold"}}>{noteAndHighlight.highlight}</Typography>
                            }
                            {note}
                        </div>
                    )
                })}
                {props.releaseNotes && props.releaseNotes.map((note, idx) => {
                    if (typeof note === "string") {
                        return (
                            <Typography key={idx} style={{marginBottom: idx !== props.releaseNotes!.length - 1 ? spacing(1) : undefined}}>
                                {note}
                            </Typography>
                        )
                    } else {
                        return (
                            <div key={idx}>
                                {note}
                            </div>
                        )
                    }
                })}
            </div>
        </ExpansionPanelDetails>
    </ExpansionPanel>
)

const sasV2BarData: BarData[] = [
    {
        x: 69,
        y: 44.74
    },
    {
        x: 81,
        y: 55.01
    },
    {
        x: 78,
        y: 55.52
    },
    {
        x: 99,
        y: 70.59
    },
    {
        x: 73,
        y: 48.12
    },
    {
        x: 77,
        y: 51.98
    },
    {
        x: 90,
        y: 62.54
    },
    {
        x: 87,
        y: 59.22
    },
    {
        x: 86,
        y: 59.45
    },
    {
        x: 79,
        y: 53.82
    },
    {
        x: 84,
        y: 59.08
    },
    {
        x: 83,
        y: 54.62
    },
    {
        x: 74,
        y: 49.93
    },
    {
        x: 70,
        y: 44.72
    },
    {
        x: 72,
        y: 45.1
    },
    {
        x: 80,
        y: 51.29
    },
    {
        x: 76,
        y: 51.99
    },
    {
        x: 82,
        y: 55.73
    },
    {
        x: 85,
        y: 59.46
    },
    {
        x: 75,
        y: 48.57
    },
    {
        x: 71,
        y: 44.31
    },
    {
        x: 89,
        y: 61.78
    },
    {
        x: 68,
        y: 44.1
    },
    {
        x: 62,
        y: 33.71
    },
    {
        x: 65,
        y: 42.29
    },
    {
        x: 88,
        y: 60.17
    },
    {
        x: 63,
        y: 39.77
    },
    {
        x: 92,
        y: 62.12
    },
    {
        x: 58,
        y: 40
    },
    {
        x: 67,
        y: 40.36
    },
    {
        x: 91,
        y: 61.35
    },
    {
        x: 61,
        y: 32.81
    },
    {
        x: 66,
        y: 41.03
    },
    {
        x: 64,
        y: 41.34
    },
    {
        x: 94,
        y: 69.77
    },
    {
        x: 93,
        y: 58.11
    },
    {
        x: 60,
        y: 30.95
    },
    {
        x: 96,
        y: 71.43
    },
    {
        x: 59,
        y: 38.46
    },
    {
        x: 95,
        y: 66.67
    },
    {
        x: 57,
        y: 42.86
    },
    {
        x: 98,
        y: 100
    },
    {
        x: 56,
        y: 50
    },
    {
        x: 50,
        y: 50
    }
]
