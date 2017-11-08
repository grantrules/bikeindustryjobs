import React from 'react'

class ControlledForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }
    
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
            [name]: value
        });
    }

    error(error) {
        this.setState({error});
    }

}

export default ControlledForm