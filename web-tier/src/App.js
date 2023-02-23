import React, { useState } from 'react';
import "./App.css";
import Axios from 'axios';

//const url = 'http://internal-BB-int-LB-985798946.us-east-1.elb.amazonaws.com/campaigns';
//const url = 'http://174.129.58.223:8080/campaigns/';

function App() {

  // const url = "/campaigns";
  const url = "http://54.209.149.101:8080/campaigns";

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [newAmount, setNewAmount] = useState(0);
  const [campaignList, setCampaignList] = useState([]);

  const addCampaign = () => {
    Axios.post(url+"/create", {
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
    Axios.get(url).then((response) => {
      setCampaignList(response.data);
    })
  };

  const updateCampaignAmount = (id) => {
    Axios.put(url+"/update/"+id, { amount: newAmount, id: id }).then(
      (response) => {
        //console.log(amount, id);
        setCampaignList(
          campaignList.map((val) => {
            return val.id == id
              ? {
                  id: val.id,
                  name: val.name,
                  amount: newAmount,
                }
              : val;
            console.log(val => val.id === id);
          })
        );
      }
    );
  };

  const deleteCampaign = (id) => {
    Axios.delete(url+"/delete/"+id).then((response) => {
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
        <button onClick={addCampaign}>Add Campaign</button>
      </div>

      <div className="Campaigns">
        <button onClick={getCampaigns}>Show Campaigns</button>

        {campaignList.map((val, key) => {
          return (
            <div className="Campaign">
              <div>
                <h3>Name: {val.name}</h3>
                <h3>Amount: {val.amount}</h3>
              </div>
              <div className="CampaignOpt">
                <input
                  type="text"
                  placeholder="Type new amount..."
                  onChange={(event) => {
                    setNewAmount(event.target.value);
                  }}
                />
                <button
                  onClick={() => {
                    updateCampaignAmount(val.id);
                  }}
                >
                  {" "}
                  Update
                </button>

                <button
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