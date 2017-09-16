'use strict';

import { connect } from 'react-redux';

import { popPageAndLog } from '../actions/page';
import StatusBar from '../components/statusbar';

const mapStateToProps = (state) => {
    return {
        enableButton: state.ouchapp.activeButton,
        text: state.ouchapp.title
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onButtonClick: () => {
            dispatch(popPageAndLog())
        }
    }
}

const TopBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(StatusBar)

export default TopBar