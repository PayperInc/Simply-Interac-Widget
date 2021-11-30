import React, { useContext } from "react";
import Bank from "./Bank";
import SearchBanks from "../SearchBanks";
import { WidgetContext } from "../../WidgetContext";
import { selectBankSearchResults } from "../../selectors";

const BankList = () => {
  const { state } = useContext(WidgetContext);

  const bankSearchResults = selectBankSearchResults(state);

  const renderBanks = () => {
    if (bankSearchResults) {
      if (bankSearchResults.length === 0) {
        /* we can also filter according to 'order #', then map instead of slicing 
          We're artificial selecting the top banks by only choosing the ones with an order number - the rest of the Credit Unions and bank are blank
        */
        if (state.banks){
          return state.banks
            .filter(function (bank){
              return bank.order !== "" ;
            })
            .map((bank, index) => (
              <Bank
                key={bank.shortName}
                shortName={bank.shortName}
                src={bank.logo}
                id={bank.id}
                bank_id={bank.bank_id}
                index={index}
                order={bank.order}
              />
            ));
        }
      } else {
        return bankSearchResults.map((bank) => (
          <Bank
            key={bank.shortName}
            shortName={bank.shortName}
            src={bank.logo}
            id={bank.id}
            bank_id={bank.bank_id}
          />
        ));
      }
    }
  };

  return (
    <div className="Banks">
      <SearchBanks />
      <div className="BanksSectionContainer">
        <div className="BanksSection">
          <div className="BanksContainerGrid">
            {state && renderBanks()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankList;
