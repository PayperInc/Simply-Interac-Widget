import "regenerator-runtime/runtime";
import { useState, useEffect } from "react";
import axios from "axios";
import { env } from "../constants/environment";

//This is being used to check for new users. The backend will check the DB and if the user does not exist, a new user will be created.
export const checkUser = (reqBody) => {
  const [dbPostData, setDbPostData] = useState(null);
  //loading status
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  //error handling
  const [hasErrorPost, setHasErrorPost] = useState(false);
  const [errorMessagePost, setErrorMessagePost] = useState("");

  const URL = `${env}checkUser`;
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingPost(true);

      try {
        const response = await axios.post(URL, reqBody);
        if (response) {
          setDbPostData(response.data);
        } else {
          setHasErrorPost(true);
          setErrorMessagePost(response);
        }
        setIsLoadingPost(false);
      } catch (err) {
        setHasErrorPost(true);
        setErrorMessagePost(err.message);
        setIsLoadingPost(false);
      }
    };
    fetchData();
  }, []);
  return { dbPostData, isLoadingPost, hasErrorPost, errorMessagePost };
};
export default checkUser;
