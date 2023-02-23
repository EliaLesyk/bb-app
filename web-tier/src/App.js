import React, { useState } from 'react';
import "./App.css";
import Axios from 'axios';


function App() {

  const api = "/campaigns";

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [newAmount, setNewAmount] = useState(0);
  const [campaignList, setCampaignList] = useState([]);

  const addCampaign = () => {
    Axios.post(api+"/create", {
      name: name,
      amount: amount,
    }).then(() => {
      setCampaignList([
        ...campaignList, {
          name: name,
          amount: amount,
        },
      ]);
    });
  };

  const getCampaigns = () => {
    Axios.get(api).then((response) => {
      setCampaignList(response.data);
    })
  };

  const updateCampaignAmount = (id, name) => {
    Axios.put(api+"/update/"+id, { amount: newAmount, id: id, name: name }).then(
      (response) => {
        setCampaignList(
          campaignList.map((val) => {
            return val.id == id, val.name == name
              ? {
                  id: val.id,
                  name: val.name,
                  amount: newAmount,
                }
              : val;
          })
        );
      }
    );
  };

  const deleteCampaign = (id) => {
    Axios.delete(api+"/delete/"+id).then((response) => {
      setCampaignList(
        campaignList.filter((val) => {
          return val.id != id;
        })
      );
    });
  };

  return (
    <div className="App">
      <img src='https://bb-ha-site.s3.eu-central-1.amazonaws.com/GiveBack_logo.png' alt="3T Web App Architecture" style={{height:180,width:200}} />
      <div className="Information">
        <label>Campaign Name:</label>
        <input type="text" onChange={(event) => {
          setName(event.target.value);
        }} />
        <label>Donation Amount:</label>
        <input type="number" onChange={(event) => {
          setAmount(event.target.value);
        }} />
        <button class="button-4" onClick={addCampaign}>Add Campaign</button>
      </div>

      <div className="Campaigns">
        <button class="button-4" onClick={getCampaigns}>Show Campaigns</button>

        {campaignList.map((val, key) => {
          return (
            <div className="Campaign">
              <div className="CampaignTitle">
                <h3>Name: {val.name}</h3>
                <h3>Amount: {val.amount}</h3>
              </div>
              <div className="CampaignOpt">
                <input class="input-type"
                  type="text"
                  placeholder="Type new amount..."
                  onChange={(event) => {
                    setNewAmount(event.target.value);
                  }}
                />
                <button class="button-4"
                  onClick={() => {
                    updateCampaignAmount(val.id, val.name);
                  }}
                >
                  {" "}
                  Update
                </button>

                <button class="button-4"
                  onClick={() => {
                    deleteCampaign(val.id);
                  }}
                >
                  Delete Campaign
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;