// To do: limit number of images, minimum number of points select, highlight points when selected/show pw,
// take uesr back to choose new pw

import React, { useState, useEffect, Component } from 'react';
import {Link as ReachLink} from 'react-router-dom';
import {Box, Flex, Grid, GridItem, Heading, Image, Stack, Text, Input, Button, Fade, Link, useDisclosure, useBoolean} from '@chakra-ui/react';

var selectedImagesArray = [];
function push_to_img_arry(imgName)
{
  if (!selectedImagesArray.includes(imgName))
  {
    selectedImagesArray.push(imgName);
  }
  //console.log(selectedImagesArray);
}

function remove_from_img_arry(imgName)
{
  const index = selectedImagesArray.indexOf(imgName);
  if (index > -1) {
    selectedImagesArray.splice(index, 1);
  }
  //console.log(selectedImagesArray);
}
var str = "";
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

function GetCoordinates(e,id,imgName)
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

  str = str + imgName + " " + PosX + " " + PosY + ", ";
  console.log(str);
}

function Test() {

  const [allImagesArray, setAllImagesArray] = useState([]);
  const [radii, setRadii] = useState([]);
  //const [submittedImages, setSubmittedImages] = useBoolean(false)
  //const [passwordTriedOnce, setPasswordTriedOnce] = useBoolean(false)
  const [submittedImages, setSubmittedImages] = useState(false)
  const [passwordTriedOnce, setPasswordTriedOnce] = useState(false)
  const [gotPasswordCorrect, setGotPasswordCorrect] = useState(false)
  const [submittedPassword, setSubmittedPassword] = useState(false)
  const [numberOfAttempts, setNumberOfAttempts] = useState(0);
  const [numberOfPasswords, setNumberOfPasswords] = useState(0);
  var rArray = [100, 2];
  const [rIndex, setRIndex] = useState(0);
  const [currentR, setCurrentR] = useState(rArray[rIndex]);
  console.log(rArray[0]);
  useEffect(() => {
    const data = fetch('http://127.0.0.1:5000/get_password_images')
    .then(response => response.json()).then(data => setAllImagesArray(data))
    const radii = fetch('http://127.0.0.1:5000/getR')
    .then(response => response.json()).then(radii => setRadii(radii))
    }, []);

    const images = allImagesArray.map(image => {
      //console.log('http://127.0.0.1:5000/get_image/'+image);
      var id_num = allImagesArray.indexOf(image);
      return <HomepageListItem id={id_num} imgName = {image} imgSrc={'http://127.0.0.1:5000/get_image/'+image} imgWidth={150} imgHeight={150}/>
    });


    const selectedImages = selectedImagesArray.map(image => {
      //console.log('http://127.0.0.1:5000/get_image/'+image);
      var id_num = allImagesArray.indexOf(image);
      return <PasswordImage id={id_num} imgName = {image} imgSrc={'http://127.0.0.1:5000/get_image/'+image} imgWidth={150} imgHeight={150}/>
    });

    if (passwordTriedOnce){str = str + ";"}


    function sendSignup(){
      //setGotPasswordCorrect(true);
      setSubmittedPassword(true);


    if (submittedPassword)
    {
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'signup request' },
          body: JSON.stringify({ username: 'React POST Request Example', radial_distance: '5', password: str  })
      };
      const data = fetch('http://127.0.0.1:5000/signup', requestOptions)
          .then(response => response.json())

      setNumberOfAttempts(numberOfAttempts + 1);
      if(numberOfAttempts == 3)
      {
        console.log('3 tries');
      }

      //setGotPasswordCorrect(true);

          //.then(data => this.setState({ postId: data.id }));

      //const data = fetch('http://127.0.0.1:5000/signup')
      //.then(response => response.json()).then(data => setAllImagesArray(data))
      // Send post request with signup info
    }
    console.log(numberOfAttempts);

    }



    function reset(){
      setNumberOfPasswords(numberOfPasswords + 1);
      setSubmittedImages(false);
      setPasswordTriedOnce(false);
      setGotPasswordCorrect(false);
      setNumberOfAttempts(0);
      str = "";
      selectedImagesArray = [];

      if (numberOfPasswords == 2)
      {
        setRIndex(rIndex + 1);
        setCurrentR(rArray[rIndex]);
      }
      // if (rIndex == 1)
      // {
      //
      // }
    }

      // setSubmittedImages.off;

      // setPasswordTriedOnce(false);
      // setGotPasswordCorrect(false);
      // selectedImagesArray = [];
      // str = "";


    return (

      !submittedImages ?
      <div className="Pw">
        This is the pw page!
        <Stack>
          <Input w={200} placeholder='Username' />
        </Stack>
          <Stack m={100} direction={['column', 'row']} spacing='24px'>
          {images}
          </Stack>
          <button onClick={() => setSubmittedImages(true)}>Enter</button>
      </div> :
      !passwordTriedOnce ?
      <div className="Pw">
        Select points on the images, rememeber the order of points that you selected!
        <Stack>
          <Input w={200} placeholder='Username' />
          <Button w={100}> Enter </Button>
        </Stack>
        <Stack m={100} direction={['column', 'row']} spacing='24px'>
        {selectedImages}
        </Stack>

        <button onClick={() => setPasswordTriedOnce(true)}>Enter</button>
      </div>
      :
      (numberOfAttempts < 3 && !gotPasswordCorrect) ?
      <div className="Pw">
        Reenter your password, you have 3 tries
        <Stack>
          <Input w={200} placeholder='Username' />
          <Button w={100}> Enter </Button>
        </Stack>
        <Stack m={100} direction={['column', 'row']} spacing='24px'>
        {selectedImages}
        </Stack>
      <button onClick={() => sendSignup()}>Submit</button>
      </div>
      :
      gotPasswordCorrect ?
      <div className="Pw">
        Password correct, signup complete, choose new images
        <Button onClick={() => reset()}>
          Click here
        </Button>
      </div>
      :
      <div className="Pw">
        Password incorrect, choose new images
        <Button onClick={() => reset()}>
          Click here
        </Button>
      </div>

    )
}
export default Test;

const HomepageListItem = ({ id, imgName, imgSrc, imgWidth, imgHeight}: HomepageListItemProps) => {
  //const [selected, setSelected] = useBoolean();
  const [selected, setSelected] = useState(false);
  const [inArray, setInArray] = useState(false);

  function changeState(){

    //If (selectedImagesArray.length == 2 )
    if (selected && inArray){
      setSelected(false);
      remove_from_img_arry(imgName);
      setInArray(false);
    }

    // If room in array, and not already in array
    else if (selectedImagesArray.length < 2 && !inArray)
    {
      setSelected(true);
      push_to_img_arry(imgName);
      setInArray(true);
    }

    else if (selectedImagesArray.length == 2 && !inArray)
    {
      console.log("max 2 images"); // display this
    }



  }

    return (
          <Box>
                <Image id={id} src={imgSrc} h={imgHeight} w={imgWidth} marginLeft='auto' m={10} marginRight={['auto', 'auto', 0, 0]}
                border={selected ? '3px solid black' : '#A52A2A'} onClick={() => changeState()}/>
          </Box>
    );
}

const PasswordImage = ({ id, imgName, imgSrc, imgWidth, imgHeight}: PasswordImageProps) => {
    return (
          <Box>
                <Image id={id} imgName={imgName} src={imgSrc} h={imgHeight} w={imgWidth} marginLeft='auto' m={100} marginRight={['auto', 'auto', 0, 0]}
                onClick={()=>GetCoordinates(this, id, imgName)}/>
          </Box>
    );
}
