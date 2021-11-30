import "regenerator-runtime/runtime";
import { useState, useEffect } from "react";
import axios from "axios";
import { env } from "../constants/environment";

export const GetIPAddress = () => {
  const [ipDetails, setIpDetails] = useState(null);
  const [isLoadingIp, setIsLoadingIp] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoadingIp(true);
    const getIP = async () => {
      try {
        let response = await axios.get(`${env}checkIp`);
        await setIpDetails(response.data);
        setIsLoadingIp(false);
      } catch (error) {
        if (error) {
          setIsError(true);
          console.log("error connecting to API", error);
        }
      }
    };
    getIP();
  }, []);
  return [ipDetails, isLoadingIp, isError];
};

export default GetIPAddress;
