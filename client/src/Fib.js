import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
    
    state = {
        seenIndicies: [],
        calculatedValues: {},
        index: ''
    };

    componentDidMount() {
        this.fetchValues();
        this.fetchIndicies();
    }

    async fetchValues() {
        const values = await axios.get('/api/values/current');
        this.setState({
            calculatedValues: values.data
        });
    }

    async fetchIndicies() {
        const seenIndicies = await axios.get('/api/values/all');
        this.setState({
            seenIndicies: seenIndicies.data
        });
    }

    handleSubmit = async (event) => {
        /* Make sure it does not call itself */
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        });
        this.setState({index: ''});
         
    };

    /* About the calculated values: Redis returns an object */

    renderCalculatedValues() {
        const entries = [];

        for (let key in this.state.calculatedValues) {
            entries.push(
                <div key={key}>
                    For index {key}, I calculated {this.state.calculatedValues[key]}
                </div>
            );
        }

        return entries;
    }

     /* About the seen indexes: Postgres returns by default an array of objects (hence the map() to just extract 
       the index from the object and join all of them with a nice separator */

    renderSeenIndicies() {
        return this.state.seenIndicies.map(({ number }) => number).join(' | ');
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index:</label>
                    <input
                        value={this.state.index}
                        onChange={event => this.setState({ index: event.target.value })}
                    />
                    <button>Submit</button>
                </form>

                <h3>Indicies I have seen:</h3>
                { this.renderSeenIndicies() }

                <h3>Calculated values:</h3>
                { this.renderCalculatedValues() }
            </div>
        );

    }

};

export default Fib;
