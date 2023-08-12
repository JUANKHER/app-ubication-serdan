import { Platform } from "react-native"


const theme = {
    appBar: {
        primary: '#24292e',
        secondary: '#999',
        primaryText: '#fff'
    },
    colors: {
        textPrimary: '#24292e',
        textSecondary: '#7d7d7d',
        primary: '#0366d6',
        white: '#fefefe'
    },
    fondSizes: {
        body: 14,
        subheading: 16
    },
    fonts: {
        main: Platform.select({
            ios: 'Arial',
            android: 'Roboto',
            default: 'System'
        })
    },
    fontWeights: {
        normal: '400',
        bold: '700'
    }
}

export default theme