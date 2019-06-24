import React, { Component } from 'react';
import axios from 'axios';

import '../scss/components/input.scss';

class Input extends Component {
 constructor(props) {
  super(props);
  this.state = {
    url: 'http://localhost:3000/upload',
    config: {
      headers: { 
        "X-Requested-With": "XMLHttpRequest" 
      },
      onUploadProgress: event => {
        let progress = Math.round((event.loaded * 100.0) / event.total);
        console.log(progress)
      }
    },
    images: [],
    previews: [],
    upload: new FormData(),
    uploadCount: 0
  }
 }

 renderPreviews = () => {
   const { previews } = this.state;
   return previews.map(preview => {
    return (
      <figure>
        <img src={`${preview}`}/>
      </figure>
    )
   })
 }

 handleUpload = (image) => {
  const { url, config, upload } = this.state;
  upload.append('upload', image);
  axios.post(url, upload, config).then(res => {
    if (res) {
      console.log(res)
    }
  }).catch(err => {
    console.log(err, 'error here')
  })
 }

 handlePreview = (image) => {
   const imageReader = new FileReader();
   imageReader.readAsDataURL(image);
   imageReader.onloadend = () => {
     this.setState(prevState => {
       return {
         previews: [...prevState.previews, imageReader.result]
       }
     }, () => {
       this.handleUpload(image);
     })
   }
 }

 handlePhotos = () => {
  const imageArr = this._input.files;
  this.setState(prevState => {
    return {
      images: [...prevState.images, ...Array.from(imageArr)]
    }
  }, () => {
    Array.from(imageArr).forEach(image => {
      console.log(image);
      this.handlePreview(image)
    })
  })
 }

 render() {
   return (
     <div>
      <input type="file" id="upload"
        className={`input`}
        name="upload"
        multiple accept="image/*" 
        ref={c => (this._input = c)}
        onChange={this.handlePhotos}
        style={{
          //display: `none`
        }}/>
        <div>
          {this.renderPreviews()}
        </div>
     </div>
   )
 }
}

export default Input;