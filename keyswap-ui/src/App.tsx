import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import * as React from "react"
import { muiTheme } from "./config/MuiConfig"
import { KeyRouter } from "./config/Routes"

export class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider theme={muiTheme}>
                <KeyRouter/>
            </MuiThemeProvider>
        )
    }
}
