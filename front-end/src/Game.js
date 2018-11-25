// import htmlContent from './game.html';
import React from 'react';


class Game extends React.Component {
    render() {
        return (
            <div dangerouslySetInnerHTML={ {__html: './game.html'} } />
        );
    }
	
}

export default Game;