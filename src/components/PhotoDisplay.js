import React, { Component } from 'react';
import axios from 'axios';

import '../scss/components/photodisplay.scss';

const createFileId = ( length ) => {
  let str = "";
  for ( ; str.length < length; str += Math.random().toString( 36 ).substr( 2 ));
    return str.substr( 0, length );
}

class PhotoDisplay extends Component {
 constructor(props) {
  super(props);
  this.state = {
    url: 'http://localhost:3000/upload',
    images: [],
    previews: [],
    removed: []
  }
 }

 renderPreviews = () => {
   const { previews } = this.state;
   return previews.map(preview => {
    return (
      <figure id={`${preview.id}`}>
        <div onClick={this.removePhoto}>remove</div>
        <img src={`${preview.src}`}/>
        <span></span>
      </figure>
    )
   })
 }

 removePhoto = (event) => {
  const parentElementId = event.target.parentElement.id;
  const parentElement = event.target.parentElement
  this.setState(prevState => ({
    removed: [...prevState.removed, parentElementId]
  }), () => {
    console.log(this.state)
    parentElement.parentNode.removeChild(parentElement);
  })
 }

 initConfig = (ImageId) => {
  const config = {
    headers: { 
      "X-Requested-With": "XMLHttpRequest" 
    },
    onUploadProgress: event => {
      let progress = Math.round((event.loaded * 100.0) / event.total);
      console.log(progress);
      document.getElementById(ImageId).lastElementChild.style.height = `${100 - progress}%`
    }
  }

  return config
 }

 handleUpload = (image, ImageId) => {
  const { url } = this.state;
  const upload = new FormData();
  upload.append('upload', image);
  upload.append('imageId', ImageId)
  axios.post(url, upload, this.initConfig(ImageId)).then(res => {
    if (res) {
      console.log(res)
    }
  }).catch(err => {
    console.log(err, 'error here')
  })
 }

 handlePreview = (image, ImageId) => {
   const imageReader = new FileReader();
   imageReader.readAsDataURL(image);
   imageReader.onloadend = () => {
     const previewItem = {
       src: imageReader.result,
       id: ImageId
     }
     this.setState(prevState => {
       return {
         previews: [...prevState.previews, previewItem]
       }
     }, () => {
       this.handleUpload(image, ImageId);
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
      const ImageId = createFileId((Math.round(image.lastModified * 100)/image.lastModified));
      image.id = ImageId;
      console.log(image);
      this.handlePreview(image, ImageId)
    })
  })
 }

 handlePhotosDrop = (event) => {
  event.preventDefault();
  event.stopPropagation();
  this.removeDragOvFeedback(event);
  if (event.dataTransfer.files) {
    const imageArr = event.dataTransfer.files;
    this.setState(prevState => {
      return {
        images: [...prevState.images, ...Array.from(imageArr)]
      }
    }, () => {
      Array.from(imageArr).forEach(image => {
        const ImageId = createFileId((Math.round(image.lastModified * 100)/image.lastModified));
        image.id = ImageId;
        console.log(image);
        this.handlePreview(image, ImageId)
      })
    })
  }
 }

 sendDragOvFeedback = (event) => {
  event.preventDefault();
  event.stopPropagation();
  this._droparea.style.background = 'rgba(232, 67, 147, 0.2)';
  this._droparea.style.borderRadius = '.3rem 3rem';
  this._droparea.style.border = '.5px solid rgba(232, 67, 147, 0.8)';
  this._droparea.style.boxShadow = '0 0px 1px rgba(0, 0, 0, 0.16), 0 3px 3px rgba(0, 0, 0, 0.1)';
 }

 removeDragOvFeedback = (event) => {
  event.preventDefault();
  event.stopPropagation();
  this._droparea.style.background = '#F0F3F4';
  this._droparea.style.borderRadius = '.3rem';
  this._droparea.style.border = 'none';
  this._droparea.style.boxShadow = 'none';
 }

 render() {
   const { images, removed } = this.state;
   return (
     <div 
      className={`photodisplay`}
      ref={c => (this._droparea = c)} 
      onDragOver={this.sendDragOvFeedback}
      onDragEnter={this.sendDragOvFeedback}
      onDragLeave={this.removeDragOvFeedback}
      onDrop={this.handlePhotosDrop}>
     <h3 className={`photodisplay__h3`}>{images.length - removed.length} files chosen</h3>
     <input type="file" id="upload"
        className={`photodisplay__input`}
        name="upload"
        multiple accept="image/*" 
        ref={c => (this._input = c)}
        onChange={this.handlePhotos}
        style={{
          display: `none`
        }}/>
      <div className={`photodisplay__gallery`}>
        {this.renderPreviews()}
      </div>
      <label for="upload" className={`photodisplay__label`}></label>
     </div>
   )
 }
}

export default PhotoDisplay;