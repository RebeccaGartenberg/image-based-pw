import '../App.css';
import React, { useState } from 'react';
import dog1 from '../images/dog.jpeg'; // Tell webpack this JS file uses this image
import dog2 from '../images/dog2.jpeg';
import mountains1 from '../images/mountains1.jpeg';
import buildings1 from '../images/buildings1.jpeg';
import { Link } from 'react-router-dom';

function Home() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  const all_images = ["dog1", "dog2", "buildings1", "mountains1"];
  const [selectedImages, setselectedImages] = useState([])

  const images = all_images.map(image => {
     return <img key={image} src={image} className="img-responsive" />
  });

  const handleSubmit = (event) => {

  event.preventDefault();
  alert('The name you entered was: '+name) // send to backend
  //this.setRedirect({redirect: true});

  }

  function FindPosition(oElement)
  {
    if(typeof( oElement.offsetParent ) != "undefined")
    {
      for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
      {
        posX += oElement.offsetLeft;
        posY += oElement.offsetTop;
      }
        return [ posX, posY ];
      }
      else
      {
        return [ oElement.x, oElement.y ];
      }
  }

  const [style1, setStyle1] = useState("dog1");
  const [style2, setStyle2] = useState("dog2");
  const [style3, setStyle3] = useState("mountains1");
  const [style4, setStyle4] = useState("buildings1");

  function changeStyle1(style_unselected, style_selected)
  {

    if ({style1}.style1 == style_unselected)
    {
      setselectedImages(selectedImages.concat(style_unselected));
      setStyle1(style_selected);
    }
    else
    {
      //setselectedImages(selectedImages.filter(selectedImages => selectedImages !== style_selected))
      selectedImages.pop(style_unselected);
      setStyle1(style_unselected);

    }
    //({style}.style == "dog1") ? setStyle("dog1_selected") : setStyle("dog1")
    console.log(selectedImages)

  }

  function changeStyle2(style_unselected, style_selected)
  {

    if ({style2}.style2 == style_unselected)
    {
      setStyle2(style_selected);
      setselectedImages(selectedImages.concat(style_unselected));
    }
    else
    {
      //setselectedImages(selectedImages.filter(selectedImages => selectedImages !== style_selected))
      selectedImages.pop(style_unselected);
      setStyle2(style_unselected);
    }
    //({style}.style == "dog1") ? setStyle("dog1_selected") : setStyle("dog1")
    console.log(selectedImages)

  }


  function saveSelectedImages()
  {
    //send post request with selected images
  }

  function GetCoordinates(e,id)
  {
    var myImg = document.getElementById(id);
    var PosX = 0;
    var PosY = 0;
    var ImgPos;
    ImgPos = FindPosition(myImg);
    if (!e) var e = window.event;
    if (e.pageX || e.pageY)
    {
      PosX = e.pageX;
      PosY = e.pageY;
    }
    else if (e.clientX || e.clientY)
      {
        PosX = e.clientX + document.body.scrollLeft
          + document.documentElement.scrollLeft;
        PosY = e.clientY + document.body.scrollTop
          + document.documentElement.scrollTop;
      }
    PosX = PosX - ImgPos[0];
    PosY = PosY - ImgPos[1];
    alert(PosX)
    alert(PosY)
    //document.getElementById("x").innerHTML = PosX;
    //document.getElementById("y").innerHTML = PosY;
  }
  // if (this.props.redirect) {
  //     return <Navigate push to="/contact" />;
  //   }
  // Import result is the URL of your image
  return (
    //<img src={logo} alt="Logo" />;
    <div>
    Signup Page!
    <img className={style1} id="myImgId2" src={dog1} alt="Logo" width="256" height="256" onClick={()=>changeStyle1("dog1", "dog1_selected")}/>
    <img class={style2} id="myImgId" src={dog2} alt="Logo" width="256" height="256" onClick={()=>changeStyle2("dog2","dog2_selected")}/>
    <img class={style3} id="myImgId3" src={mountains1} alt="Logo" width="256" height="256" onClick={()=>GetCoordinates(this,"myImgId3")}/>
    <img class={style4} id="myImgId4" src={buildings1} alt="Logo" width="256" height="256" onClick={()=>GetCoordinates(this,"myImgId4")}/>


      <form onSubmit={handleSubmit}>
        <label class="label">Username:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input type="submit" />
        </label>
      </form>
      <label class="text">Select 2 images below and click enter</label>
      <button class="enter" onClick={saveSelectedImages}>Enter</button>

      <Link
      to={{
        pathname: "/login",
        state: selectedImages // your data array of objects
      }}>login</Link>

    </div>
  );
}

export default Home;
