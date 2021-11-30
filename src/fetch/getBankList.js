import "regenerator-runtime/runtime";
import axios from "axios";
import { useEffect, useState } from "react";
import { env } from "../constants/environment";

export const getBankList = () => {
    const [ bankList, setBanks ] = useState(null);
 
    useEffect(() => {
        const getBanks = async () => {
            await axios.get(`${env}getBankList`)
            .then(function (response){
                setBanks(response.data);
            })
            .catch(function (error){
                console.log(error);
            });
        };
        getBanks();
    }, [])
    return bankList;
};

export default getBankList;