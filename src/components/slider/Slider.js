import React, {Component} from 'react'
import axios from 'axios'
import './Slider.css'

class Slider extends Component {
    url = 'https://screeningtest.vdocipher.com/api/image/';
    headerPayload = {'Authorization': 'Bearer fc1be0ce7f79cfe74502163bbc76613e'};
    
    getImageList() {
        return new Promise((resolve, reject) => {
            // Call to image API to get image id lists
            axios.get(this.url, {headers: this.headerPayload}).then((response) => {

                // If API status is success
                if (response.status === 200) {

                    // Create promise chain in sequence
                    var promiseChain = [];
                    response.data.forEach(img => {
                        promiseChain.push(axios.post(this.url + img.id, {}, {headers: this.headerPayload}));
                    });

                    // Called all promise chain in sequence to get image data from server
                    var sliderImages = [];
                    Promise.all(promiseChain).then((result) => {
                        
                        //If server return success response then push images into sliderImages
                        result.forEach(res => {
                            if (res.status === 200) {
                                sliderImages.push({...res.data, left: 0, cls: ''});
                            }
                        });

                        resolve(sliderImages); // Return slider image response
                    });
                } else {
                    reject('Server error'); // In case face some issue
                }
            }, (error) => reject(error)) // In case face some issue
            .catch((reason) => reject(reason)); // In case face some issue
        });
    }

    componentWillMount() {
        // Update initial state value
        this.setState({
            slider: [],
            activeIndex: 0
        });

        // Fetch images from server using REST API
        this.getImageList().then((sliderImages) => {
            this.setState({
                slider: sliderImages,
                activeIndex: 0
            });
        });
    }

    prev() {
        // Get current index and update accordingly
        var nextIndex = (this.state.activeIndex === 0) 
            ? (this.state.activeIndex + (this.state.slider.length - 1)) 
            : this.state.activeIndex - 1;
        
        this.state.slider[nextIndex] = {...this.state.slider[nextIndex], left: '-100%', cls: 'moveInLeft'};
        this.state.slider[this.state.activeIndex] = {...this.state.slider[this.state.activeIndex], left: 0, cls: 'moveOutRight'};
        
        // Update state
        this.setState({
            activeIndex: nextIndex,
            slider: this.state.slider
        });
    }

    next() {
        // Get current index and update accordingly
        var nextIndex = (this.state.activeIndex === (this.state.slider.length - 1)) 
            ? (this.state.activeIndex - (this.state.slider.length - 1)) 
            : this.state.activeIndex + 1;

        this.state.slider[nextIndex] = {...this.state.slider[nextIndex], left: '100%', cls: 'moveInRight'};
        this.state.slider[this.state.activeIndex] = {...this.state.slider[this.state.activeIndex], left: 0, cls: 'moveOutLeft'};
        
        // Update state
        this.setState({
            activeIndex: nextIndex,
            slider: this.state.slider
        });
    }

    render() {
        return (
            <div className="avengers">
                <center><h3><i>Avengers Avenue</i></h3></center>
                <div className="slider">
                    <div className="slides">
                        {this.state.slider.map((item, index) => {
                            var style = {left: item.left};
                            return (<div id={item.id} key={index} style={style} className={'slide ' + item.cls}><img src={item.url} /></div>)
                        }, this)}
                    </div>
                    <div className="btn-wrap">
                        <button className="prev-btn" onClick={this.prev.bind(this)}><img src="https://s3-ap-southeast-1.amazonaws.com/he-public-data/Left%20Control577660a.png"/></button>
                        <button className="next-btn" onClick={this.next.bind(this)}><img src="https://s3-ap-southeast-1.amazonaws.com/he-public-data/Right%20Control3fc6d2d.png"/></button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        setInterval(() => this.next(), 1000); // Start automatic slider
    }
}

export default Slider;