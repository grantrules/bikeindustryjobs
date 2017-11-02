import React from 'react';
//import { Link } from 'react-router-dom';
import CompanyService from '../services/companies';



class Image extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		
	}

	fileChange(event) {
		alert('derp');
		var target = event.target.files;
		var file = event.target.files[0];

		CompanyService.getImageUploadUrl(file, (err, data) => {
			if (data) {
				this.setState({url: data.fileName});
				var postUrl = data.signedRequest;

				CompanyService.putAWSImage(postUrl, file, (err, data) => {
					console.log(err||data);
				})

				/*

				const reader = new FileReader();
			
				reader.onload = (upload) => {
					this.setState({
						data_uri: upload.target.result,
						filename: file.name,
						filetype: file.type
					});



					
				};
			
				reader.readAsDataURL(file);
				*/

			}
			console.log(err||data);
		})
	}
	
	render() {
		return (
			<div>
				<input id="fileupload" type="file" onChange={this.fileChange.bind(this)} name="fileupload"/>
				<input type="hidden" name="logo" value={this.state.url}/>
			</div>
		)
	}

}


export default Image